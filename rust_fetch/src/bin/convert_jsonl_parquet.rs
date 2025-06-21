use polars::io::json::{JsonFormat, JsonReader};
use polars::io::parquet::ParquetWriter;
use polars::prelude::*;
use std::collections::HashSet;
use std::error::Error;
use std::fs;
use std::fs::File;
use std::path::Path;

/// Converts a newline-delimited JSON file into a Parquet file.
fn main() -> Result<(), Box<dyn Error>> {
    let mut args = std::env::args().skip(1);
    let input = args
        .next()
        .expect("Usage: convert_jsonl_parquet <in.jsonl> <out_dir>");
    let output_dir = args
        .next()
        .expect("Usage: convert_jsonl_parquet <in.jsonl> <out_dir>");

    // ensure output directory exists
    fs::create_dir_all(&output_dir)?;

    let file_in = File::open(&input)?;
    let df = JsonReader::new(file_in)
        .with_json_format(JsonFormat::JsonLines)
        .finish()?;

    // extract date (YYYY-MM-DD) from the timestamp string
    let timestamps = df.column("interval_end_time")?.utf8()?;
    let mut dates = HashSet::new();
    for opt in timestamps.into_no_null_iter() {
        let date = &opt[..10];
        dates.insert(date.to_string());
    }

    // partition and write one Parquet file per date
    for date in dates {
        let mask = timestamps
            .into_iter()
            .map(|opt| opt.map(|s| s.starts_with(&date)))
            .collect::<BooleanChunked>();
        let mut sub_df = df.filter(&mask)?;

        let part_dir = Path::new(&output_dir).join(format!("date={}", date));
        fs::create_dir_all(&part_dir)?;
        let file_path = part_dir.join("part.parquet");
        let mut out_f = File::create(file_path)?;
        ParquetWriter::new(&mut out_f).finish(&mut sub_df)?;
    }

    Ok(())
}

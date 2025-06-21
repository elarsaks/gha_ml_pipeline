use std::collections::HashSet;
use std::error::Error;
use std::fs::{create_dir_all, File};
use std::path::Path;

use polars::io::json::{JsonFormat, JsonReader};
use polars::io::parquet::ParquetWriter;
use polars::prelude::*;

/// Converts a newline-delimited JSONL file into partitioned Parquet files under `output_dir`.
pub fn convert_jsonl_parquet(input: &str, output_dir: &str) -> Result<(), Box<dyn Error>> {
    // ensure output directory exists
    create_dir_all(output_dir)?;

    let file_in = File::open(input)?;
    let df = JsonReader::new(file_in)
        .with_json_format(JsonFormat::JsonLines)
        .finish()?;

    // extract unique dates (YYYY-MM-DD) from the timestamp column
    let timestamps = df.column("interval_end_time")?.utf8()?;
    let mut dates = HashSet::new();
    for opt in timestamps.into_no_null_iter() {
        let date = &opt[..10];
        dates.insert(date.to_string());
    }

    // partition and write one Parquet file per date
    for date in dates {
        let mask = df
            .column("interval_end_time")?
            .utf8()?
            .into_iter()
            .map(|opt| opt.map(|s| s.starts_with(&date)))
            .collect::<BooleanChunked>();
        let mut sub_df = df.filter(&mask)?;

        let part_dir = Path::new(output_dir).join(format!("date={}", date));
        create_dir_all(&part_dir)?;
        let file_path = part_dir.join("part.parquet");
        let mut out_f = File::create(&file_path)?;
        ParquetWriter::new(&mut out_f).finish(&mut sub_df)?;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use std::io::Write;
    use tempfile::tempdir;

    #[test]
    fn test_convert_jsonl_parquet() {
        // prepare a temp directory
        let dir = tempdir().unwrap();
        let input_file = dir.path().join("test.jsonl");
        let mut f = File::create(&input_file).unwrap();
        writeln!(
            f,
            "{{\"interval_end_time\":\"2025-01-01T00:00:00Z\",\"foo\":42}}"
        )
        .unwrap();

        let out_dir = dir.path().join("out");
        let input_path = input_file.to_str().unwrap();
        let output_path = out_dir.to_str().unwrap();
        // convert
        convert_jsonl_parquet(input_path, output_path).unwrap();

        let part = out_dir.join("date=2025-01-01").join("part.parquet");
        assert!(part.exists());

        // read back and verify
        let df = ParquetReader::new(File::open(part).unwrap())
            .finish()
            .unwrap();
        assert_eq!(df.height(), 1);
        let foo_col = df.column("foo").unwrap().i64().unwrap();
        assert_eq!(foo_col.get(0), Some(42));
    }
}

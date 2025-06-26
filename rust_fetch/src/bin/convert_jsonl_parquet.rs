use polars::prelude::*;
use std::collections::HashSet;
use std::error::Error;
use std::fs::{self, File};
use std::path::Path;

/// Converts a newline-delimited JSONL file into partitioned Parquet files under `output_dir`.
pub fn convert_jsonl_parquet(input: &str, output_dir: &str) -> Result<(), Box<dyn Error>> {
    fs::create_dir_all(output_dir)?;

    let file_in = File::open(input)?;
    let df = JsonReader::new(file_in)
        .with_json_format(JsonFormat::JsonLines)
        .finish()?;

    // extract unique dates (YYYY-MM-DD) from the timestamp column
    let dates: HashSet<_> = df
        .column("interval_end_time")?
        .utf8()?
        .into_no_null_iter()
        .map(|ts| ts[..10].to_string())
        .collect();

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
        fs::create_dir_all(&part_dir)?;

        let file_path = part_dir.join("part.parquet");
        ParquetWriter::new(File::create(file_path)?).finish(&mut sub_df)?;
    }

    Ok(())
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() != 3 {
        eprintln!("Usage: convert_jsonl_parquet <in.jsonl> <out_dir>");
        std::process::exit(1);
    }
    let input = &args[1];
    let output_dir = &args[2];
    if let Err(e) = convert_jsonl_parquet(input, output_dir) {
        eprintln!("Conversion failed: {}", e);
        std::process::exit(1);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::fs::File;
    use tempfile::tempdir;

    #[test]
    fn test_convert_jsonl_parquet() {
        let dir = tempdir().unwrap();
        let input_file = dir.path().join("test.jsonl");
        fs::write(
            &input_file,
            "{\"interval_end_time\":\"2025-01-01T00:00:00Z\",\"foo\":42}\n",
        )
        .unwrap();

        let out_dir = dir.path().join("out");
        convert_jsonl_parquet(input_file.to_str().unwrap(), out_dir.to_str().unwrap()).unwrap();

        let part = out_dir.join("date=2025-01-01").join("part.parquet");
        assert!(part.exists());

        let df = ParquetReader::new(File::open(part).unwrap())
            .finish()
            .unwrap();
        assert_eq!(df.height(), 1);
        assert_eq!(df.column("foo").unwrap().i64().unwrap().get(0), Some(42));
    }
}

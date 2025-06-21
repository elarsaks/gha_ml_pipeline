use polars::io::json::{JsonFormat, JsonReader};
use polars::io::parquet::ParquetWriter;
use polars::prelude::*;
use std::error::Error;
use std::fs::File;

/// Converts a newline-delimited JSON file into a Parquet file.
fn main() -> Result<(), Box<dyn Error>> {
    let mut args = std::env::args().skip(1);
    let input = args
        .next()
        .expect("Usage: convert_jsonl_parquet <in.jsonl> <out.parquet>");
    let output = args
        .next()
        .expect("Usage: convert_jsonl_parquet <in.jsonl> <out.parquet>");

    let file_in = File::open(&input)?;
    let mut df = JsonReader::new(file_in)
        .with_json_format(JsonFormat::JsonLines)
        .finish()?;
    let mut file_out = File::create(&output)?;
    ParquetWriter::new(&mut file_out).finish(&mut df)?;
    Ok(())
}

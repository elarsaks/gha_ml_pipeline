use gha_ml_pipeline::convert_jsonl_parquet;
use std::error::Error;

/// Converts a newline-delimited JSON file into a Parquet file.
fn main() -> Result<(), Box<dyn Error>> {
    // parse args
    let mut args = std::env::args().skip(1);
    let input = args
        .next()
        .expect("Usage: convert_jsonl_parquet <in.jsonl> <out_dir>");
    let output_dir = args
        .next()
        .expect("Usage: convert_jsonl_parquet <in.jsonl> <out_dir>");
    // delegate to library
    convert_jsonl_parquet(&input, &output_dir)
}

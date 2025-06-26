# gha-ml-pipeline

## Rust Data Pipeline Binaries

- **fetch_data**: Fetches 5-min interval BTC data from CoinYBubble and appends unique records to `data/raw/fear_and_greed_history_5min.jsonl`.
- **validate_jsonl**: Validates that a JSONL file has no duplicate `interval_end_time` values.
- **convert_jsonl_parquet**: Converts a JSONL file to partitioned Parquet files by date.

### Usage

From the rust_fetch:

```sh
# Fetch and append new data
task: cargo run --release --bin fetch_data

# Validate a JSONL file for duplicates
task: cargo run --release --bin validate_jsonl -- data/raw/fear_and_greed_history_5min.jsonl

# Convert JSONL to Parquet
task: cargo run --release --bin convert_jsonl_parquet -- ../data/raw/fear_and_greed_history_5min.jsonl ../data/processed/fear_and_greed_history_5min.parquet
```

## GitHub Actions Workflow

The workflow `.github/workflows/fetch_data.yml` will:
1. Build the Rust project
2. Run the fetch step (`fetch_data`)
3. Validate the data (`validate_jsonl`)
4. Convert to Parquet (`convert_jsonl_parquet`)
5. Commit and push changes

---


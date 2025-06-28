# Rust Data Fetch Tools

This folder contains small Rust binaries used to collect and prepare the crypto data for the pipeline. The tools are executed both locally and inside GitHub Actions.

## Prerequisites
- [Rust toolchain](https://www.rust-lang.org/tools/install)

## Building
```bash
cd rust_fetch
cargo build --release
```

## Usage
```bash
# Fetch and append the latest 5‑minute data
cargo run --release --bin fetch_data

# Validate a JSONL file to ensure there are no duplicate intervals
cargo run --release --bin validate_jsonl -- data/raw/fear_and_greed_history_5min.jsonl

# Convert a JSONL file into a partitioned Parquet dataset
cargo run --release --bin convert_jsonl_parquet -- ../data/raw/fear_and_greed_history_5min.jsonl ../data/processed/fear_and_greed_history_5min.parquet
```
The resulting files are stored under `../data/` and are committed back to the repository by the CI workflow.

## GitHub Actions
The workflow `.github/workflows/fetch_data.yml` builds these binaries, runs `fetch_data` on a schedule, validates the result and commits any new data.

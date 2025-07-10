# Data Collection

Data is stored under the [`data/`](../data/) directory.

- **Raw** data (`raw/`) contains a JSONL file with 5‑minute Bitcoin Fear & Greed history.
- **Processed** data (`processed/`) holds a Parquet dataset produced by the Rust tools.

The workflow `.github/workflows/fetch_data.yml` builds the data fetching binaries, downloads the latest entries and commits updated files back to the repository.

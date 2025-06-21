# GHA ML Pipeline: Fetching data with Rust.

This Rust App fetches 5-minute interval fear & greed history for the past 24 hours from the CoinYBubble API and appends unique entries to `data/raw/fear_and_greed_history_5min.jsonl`.

## Prerequisites

- Rust toolchain (edition 2021)
- Internet connectivity for API calls

## Usage

Run the fetcher with:

```bash
cargo run
```

Each run will:
1. Query `https://api.coinybubble.com/v1/history/5min?hours=24` for the last 24 h of data.
2. Serialize each entry into a compact JSON string.
3. Append only new timestamps to `data/raw/fear_and_greed_history_5min.jsonl`.

## Testing

Run the test suite with:

```bash
cargo test
```

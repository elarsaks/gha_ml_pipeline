# GHA ML Pipeline: Fetching data with Rust.

This Rust App fetches the latest data from the CoinYBubble API and appends it as a newline-delimited JSON entry to the `data/raw/fear_and_greed.jsonl` file in the root of the workspace.

## Prerequisites

- Rust toolchain (edition 2021)
- Internet connectivity for API calls

## Usage

Run the fetcher with:

```bash
cargo run
```

Each run will:
1. Query `https://api.coinybubble.com/v1/latest` for the latest JSON data.
2. Serialize the response into a compact JSON string.
3. Append it to `../data/raw/fear_and_greed.jsonl` as a new line.

## Testing

Run the test suite with:

```bash
cargo test
```

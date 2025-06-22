mod api_clients;
use crate::api_clients::coiny_bubble;
use gha_ml_pipeline::append_unique_jsonl_with_key;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    // Fetch 5-min history for past 24 hours (includes fear & greed)
    let history = coiny_bubble::fetch_history_5min(24)?;
    let hist_path = "../data/raw/fear_and_greed_history_5min.jsonl";

    // CoinYBubble history objects use `interval_end_time` as their timestamp
    // identifier. Ensure we avoid inserting duplicate intervals.
    append_unique_jsonl_with_key(hist_path, &history, "interval_end_time")?;

    Ok(())
}

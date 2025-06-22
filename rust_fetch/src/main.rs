mod api_clients;
use crate::api_clients::coiny_bubble;
use gha_ml_pipeline::append_unique_jsonl;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    // Fetch 5-min history for past 24 hours (includes fear & greed)
    let history = coiny_bubble::fetch_history_5min(24)?;
    let hist_path = "../data/raw/fear_and_greed_history_5min.jsonl";

    append_unique_jsonl(hist_path, &history)?;

    Ok(())
}

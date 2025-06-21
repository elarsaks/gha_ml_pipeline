mod api_clients;
use crate::api_clients::coiny_bubble;
use serde_json::Value;
use std::collections::HashSet;
use std::error::Error;
use std::fs::OpenOptions;
use std::io::Write;

fn main() -> Result<(), Box<dyn Error>> {
    // Fetch 5-min history for past 24 hours (includes fear & greed)
    let history = coiny_bubble::fetch_history_5min(24)?;
    let hist_path = "../data/raw/fear_and_greed_history_5min.jsonl";

    // Load existing timestamps to avoid duplicates
    let mut seen = HashSet::new();
    if let Ok(contents) = std::fs::read_to_string(hist_path) {
        for line in contents.lines() {
            if let Ok(val) = serde_json::from_str::<Value>(line) {
                if let Some(ts) = val.get("timestamp").and_then(|t| t.as_str()) {
                    seen.insert(ts.to_string());
                }
            }
        }
    }

    // Append only new entries to history file
    let mut hist_file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(hist_path)?;
    for entry in history {
        if let Some(ts) = entry.get("timestamp").and_then(|t| t.as_str()) {
            if seen.contains(ts) {
                continue;
            }
        }
        writeln!(hist_file, "{}", serde_json::to_string(&entry)?)?;
    }

    Ok(())
}

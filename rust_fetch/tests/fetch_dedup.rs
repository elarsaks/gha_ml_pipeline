use std::collections::HashSet;
use serde_json::Value;
use gha_ml_pipeline::append_unique_jsonl_with_key;
use std::fs;
use tempfile::NamedTempFile;

#[test]
fn test_fetch_dedup() {
    // Try fetching just 1 hour of data to keep the test lightweight.
    match gha_ml_pipeline::api_clients::coiny_bubble::fetch_history_5min(1) {
        Ok(history) => {
            let tmp = NamedTempFile::new().unwrap();
            let path = tmp.path();

            // Write twice to simulate consecutive fetch runs
            append_unique_jsonl_with_key(path.to_str().unwrap(), &history, "interval_end_time").unwrap();
            append_unique_jsonl_with_key(path.to_str().unwrap(), &history, "interval_end_time").unwrap();

            // Ensure no duplicate interval_end_time values exist
            let contents = fs::read_to_string(path).unwrap();
            let mut seen = HashSet::new();
            for line in contents.lines() {
                let v: Value = serde_json::from_str(line).unwrap();
                let ts = v["interval_end_time"].as_str().unwrap();
                assert!(seen.insert(ts.to_string()), "duplicate {}", ts);
            }
        }
        Err(e) => eprintln!("Skipping test due to network error: {e}"),
    }
}

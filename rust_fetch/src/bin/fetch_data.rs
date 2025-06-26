use reqwest::blocking::Client;
use serde_json::Value;
use std::error::Error;
use std::io::{Error as IoError, ErrorKind};
use std::{
    collections::HashSet,
    fs::{File, OpenOptions},
    io::{BufRead, BufReader, Write},
    path::Path,
};

/// Fetches 5-minute history for the past `hours` hours.
fn fetch_history_5min(hours: u32) -> Result<Vec<Value>, Box<dyn Error>> {
    let url = format!(
        "https://api.coinybubble.com/v1/history/5min?hours={}",
        hours
    );
    let client = Client::new();
    let resp = client
        .get(&url)
        .send()?
        .error_for_status()?
        .json::<Value>()?;
    let arr = resp
        .as_array()
        .ok_or_else(|| {
            Box::new(IoError::new(
                ErrorKind::Other,
                "Expected JSON array from history endpoint",
            )) as Box<dyn Error>
        })?
        .clone();
    Ok(arr)
}

/// Reads existing `interval_end_time` values from a JSONL file into a HashSet.
pub fn existing_intervals(path: &str) -> HashSet<String> {
    let file = File::open(path).unwrap_or_else(|_| File::create(path).unwrap());
    let reader = BufReader::new(file);
    reader
        .lines()
        .filter_map(|line| {
            line.ok().and_then(|l| {
                serde_json::from_str::<Value>(&l)
                    .ok()?
                    .get("interval_end_time")
                    .and_then(|v| v.as_str().map(|s| s.to_string()))
            })
        })
        .collect()
}

/// Appends new entries to a JSONL file, skipping any with duplicate `interval_end_time`.
pub fn append_unique_records(path: &str, records: &[Value]) -> Result<(), Box<dyn Error>> {
    let existing = existing_intervals(path);
    let mut file = OpenOptions::new().create(true).append(true).open(path)?;

    for record in records {
        if let Some(ts) = record.get("interval_end_time").and_then(|v| v.as_str()) {
            if existing.contains(ts) {
                continue;
            }
            writeln!(file, "{}", serde_json::to_string(record)?)?;
        }
    }

    Ok(())
}

/// Fetches 5-min history and appends unique records to the JSONL file.
pub fn run() -> Result<(), Box<dyn Error>> {
    // Fetch 5-min history for past 24 hours (includes fear & greed)
    let history = fetch_history_5min(24)?;

    // Build the data path relative to the crate directory.
    let hist_path =
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../data/raw/fear_and_greed_history_5min.jsonl");

    // Append fetched records to the JSONL file, ensuring no duplicates.
    append_unique_records(hist_path.to_str().expect("valid UTF-8 path"), &history)?;

    Ok(())
}

fn main() {
    if let Err(e) = run() {
        eprintln!("Error: {}", e);
        std::process::exit(1);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn test_append_unique_records() {
        let dir = tempdir().unwrap();
        let file = dir.path().join("hist.jsonl");

        // write an existing record
        fs::write(&file, "{\"interval_end_time\":\"t1\", \"v\":1}\n").unwrap();

        let new_entries = vec![
            serde_json::json!({"interval_end_time": "t1", "v": 2}),
            serde_json::json!({"interval_end_time": "t2", "v": 3}),
        ];

        append_unique_records(file.to_str().unwrap(), &new_entries).unwrap();

        let file_content = fs::read_to_string(&file).unwrap();
        let lines: Vec<_> = file_content.lines().collect();
        assert_eq!(lines.len(), 2);
        let values: Vec<Value> = lines
            .iter()
            .map(|l| serde_json::from_str(l).unwrap())
            .collect();
        assert_eq!(values[0]["interval_end_time"], "t1");
        assert_eq!(values[1]["interval_end_time"], "t2");
    }
}

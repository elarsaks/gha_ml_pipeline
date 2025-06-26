use std::env;
use std::process;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        eprintln!("Usage: validate_jsonl <path-to-jsonl>");
        process::exit(1);
    }
    let path = &args[1];
    if let Err(e) = validate_no_duplicates_jsonl(path) {
        eprintln!("Validation failed: {}", e);
        process::exit(1);
    }
}

use serde_json::Value;
use std::collections::HashSet;
use std::error::Error;
use std::fs::File;
use std::io::{BufRead, BufReader};

/// Validates that there are no duplicate `interval_end_time` values in a JSONL file.
/// Returns Ok(()) if no duplicates, or an Err with a message if duplicates are found.
pub fn validate_no_duplicates_jsonl(path: &str) -> Result<(), Box<dyn Error>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    let mut seen = HashSet::new();
    let mut duplicates = HashSet::new();

    for line in reader.lines() {
        let line = line?;
        if let Ok(val) = serde_json::from_str::<Value>(&line) {
            if let Some(ts) = val.get("interval_end_time").and_then(|t| t.as_str()) {
                if !seen.insert(ts.to_string()) {
                    duplicates.insert(ts.to_string());
                }
            }
        }
    }

    if !duplicates.is_empty() {
        Err(format!("Duplicate interval_end_time values found: {:?}", duplicates).into())
    } else {
        println!("No duplicate interval_end_time values found.");
        Ok(())
    }
}

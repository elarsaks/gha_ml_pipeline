mod api_clients;

use api_clients::coiny_bubble;
use std::error::Error;
use std::fs::OpenOptions;
use std::io::Write;

fn main() -> Result<(), Box<dyn Error>> {
    // Fetch the latest data
    let data = coiny_bubble::fetch_latest()?;
    // Serialize to a compact JSON string
    let s = serde_json::to_string(&data)?;
    // Append to the JSONL file
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("../data/raw/fear_and_greed.jsonl")?;
    writeln!(file, "{}", s)?;
    Ok(())
}

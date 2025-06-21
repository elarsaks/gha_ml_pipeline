use reqwest::blocking::Client;
use serde_json::Value;
use std::error::Error;
use std::io::{Error as IoError, ErrorKind};

/// Fetches 5-minute history for the past `hours` hours.
pub fn fetch_history_5min(hours: u32) -> Result<Vec<Value>, Box<dyn Error>> {
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

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_fetch_history_5min() {
        let data = fetch_history_5min(1).unwrap();
        assert!(data.iter().all(|v| v.is_object()));
    }
}

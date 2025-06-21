use reqwest::blocking::Client;
use serde_json::Value;
use std::error::Error;

/// Fetches the latest data from the CoinYBubble API.
pub fn fetch_latest() -> Result<Value, Box<dyn Error>> {
    let url = "https://api.coinybubble.com/v1/latest";
    let client = Client::new();
    let resp = client
        .get(url)
        .send()?
        .error_for_status()? // ensure we got a 2XX
        .json::<Value>()?; // parse into a serde_json::Value
    Ok(resp)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_fetch_latest() {
        let data = fetch_latest().unwrap();
        // basic smoke-test: should have some JSON object
        assert!(data.is_object());
    }
}

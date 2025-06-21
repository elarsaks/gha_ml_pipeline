import argparse
import os
from datetime import datetime

import polars as pl
from sklearn.linear_model import LinearRegression
from utils.save_weights import save_weights

from data.load_data import load_data


def train_and_save(input_dir: str, output_path: str):
    # Load data
    df = load_data(input_dir)
    # Ensure timestamp and value columns exist
    if "timestamp" not in df.columns or "value" not in df.columns:
        raise ValueError("DataFrame must contain 'timestamp' and 'value' columns")
    # Convert timestamp to numeric (seconds since epoch)
    df = df.with_column(
        pl.col("timestamp").str.strptime(pl.Datetime, fmt=None).dt.timestamp().cast(pl.Int64).alias("ts")
    )
    # Extract features and target as numpy arrays
    X = df["ts"].to_numpy().reshape(-1, 1)
    y = df["value"].to_numpy()
    # Train linear regression
    model = LinearRegression()
    model.fit(X, y)
    # Collect weights
    weights = {"ts_coef": model.coef_[0], "intercept": model.intercept_}
    # Determine final output path (directory yields timestamped filename)
    if output_path.lower().endswith(".csv"):
        # explicit file path
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        final_output = output_path
    else:
        # treat as directory
        os.makedirs(output_path, exist_ok=True)
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        final_output = os.path.join(output_path, f"model_{timestamp}.csv")
    # Save weights to CSV
    save_weights(weights, final_output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train model on fear & greed Parquet data")
    parser.add_argument("--input", type=str, required=True, help="Directory containing Parquet files")
    parser.add_argument("--output", type=str, required=True, help="Output CSV file for weights")
    args = parser.parse_args()
    train_and_save(args.input, args.output)

import os

import polars as pl


def load_data(parquet_dir: str) -> pl.DataFrame:
    """
    Load all Parquet files from the given directory (recursively) into a single DataFrame.
    """
    files = []
    for root, _, filenames in os.walk(parquet_dir):
        for f in filenames:
            if f.endswith(".parquet"):
                files.append(os.path.join(root, f))
    if not files:
        raise ValueError(f"No parquet files found in {parquet_dir}")
    dfs = [pl.read_parquet(f) for f in files]
    df = pl.concat(dfs)
    # sort by timestamp if present
    if "timestamp" in df.columns:
        df = df.sort("timestamp")
    return df

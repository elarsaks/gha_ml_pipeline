import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

import polars as pl
import train


def test_train_creates_model_file(tmp_path, monkeypatch):
    # Setup: create fake data
    data_dir = tmp_path / "data" / "processed"
    data_dir.mkdir(parents=True)
    models_dir = tmp_path / "models"
    models_dir.mkdir()
    parquet_path = data_dir / "fear_and_greed_history_5min.parquet"
    df = pl.DataFrame(
        {
            "open_actual_value": [1, 2, 3, 4],
            "open_bitcoin_price_usd": [10, 20, 30, 40],
            "high_bitcoin_price_usd": [15, 25, 35, 45],
            "low_bitcoin_price_usd": [5, 15, 25, 35],
            "avg_actual_value": [2, 3, 4, 5],
            "close_bitcoin_price_usd": [12, 22, 32, 42],
        }
    )
    df.write_parquet(parquet_path)

    # Patch Path in train module to use tmp_path as repo_root
    monkeypatch.setattr(train, "repo_root", tmp_path)

    # Run training
    train.main()

    # Check model file exists
    model_file = models_dir / "model_v1.csv"
    assert model_file.exists(), f"Model file {model_file} was not created"
    # Check file is not empty
    assert model_file.stat().st_size > 0
    # Check CSV has expected columns
    weights = pl.read_csv(model_file)
    assert set(weights.columns) == {"feature", "weight"}
    assert "intercept" in weights["feature"].to_list()

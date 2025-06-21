from pathlib import Path

import polars as pl
from sklearn.linear_model import LinearRegression

repo_root = Path(__file__).resolve().parents[2]


def main():
    data_path = repo_root / "data" / "processed" / "fear_and_greed_history_5min.parquet"
    df = pl.read_parquet(data_path).drop_nulls()

    feature_cols = [
        "open_actual_value",
        "open_bitcoin_price_usd",
        "high_bitcoin_price_usd",
        "low_bitcoin_price_usd",
        "avg_actual_value",
    ]

    X = df.select(feature_cols).to_numpy()
    y = df["close_bitcoin_price_usd"].to_numpy()

    model = LinearRegression()
    model.fit(X, y)

    weights = pl.DataFrame(
        {
            "feature": ["intercept", *feature_cols],
            "weight": [model.intercept_, *model.coef_],
        }
    )

    models_dir = repo_root / "models"
    models_dir.mkdir(exist_ok=True)
    weights.write_csv(models_dir / "model_v1.csv")
    print(f"Model weights saved to {models_dir / 'model_v1.csv'}")


if __name__ == "__main__":
    main()

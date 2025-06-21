# gha-ml-pipeline

This project contains utilities for fetching and processing crypto data and a simple Python training project.

## Python Training

The `python_train` directory uses [Poetry](https://python-poetry.org/) to manage dependencies.
It trains a linear regression model to predict the Bitcoin closing price using the
preprocessed data in `data/processed/fear_and_greed_history_5min.parquet`.
The model weights are saved to `./models/model_v1.csv`.

### Run Training

```bash
cd python_train
poetry install
poetry run python src/train.py
```

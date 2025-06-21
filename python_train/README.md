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

## Model Training

A Python project using Poetry to train a linear model on the Parquet data.

Steps:
1. Change into the model directory and install dependencies:

   ```bash
   cd python_train
   poetry install
   ```
2. Train the model and save weights:

   ```bash
   poetry run python src/train.py
   ```
   The model weights will be saved to the root-level `models/model_v1.csv` file.

3. Run Python tests:

   ```bash
   poetry run pytest
   ```

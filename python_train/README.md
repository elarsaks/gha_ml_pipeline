# Python Training Pipeline

This folder contains the machine learning code for training a simple model to predict the Bitcoin Fear & Greed Index. It relies on a Conda environment and is designed to run automatically in GitHub Actions.

## Prerequisites
- [Conda](https://docs.conda.io/en/latest/miniconda.html) installed
- Python 3.10 or later

## Setup
```bash
cd python_train
conda env create -f environment.yml  # only needed once
conda activate btc_predictor
```

## Development and Training
The workflow is contained in `linear_regression_training.ipynb`. Open the notebook and run all cells to train the model:
```bash
jupyter notebook linear_regression_training.ipynb
```
The notebook reads the processed dataset from `../data/processed/fear_and_greed_history_5min.parquet` and saves the trained weights to `../models/`.

## Running Tests
```bash
pytest
```

## Extending
- Modify the notebook or add Python modules under `src/` for additional models or data processing.
- Adjust the Conda dependencies in `environment.yml` as needed.

All trained model files are committed back to the repository via GitHub Actions so that the history of models is preserved.

# gha-ml-pipeline

This project contains utilities for fetching and processing crypto data and a simple Python training project.

## Python Training

The `python_train` directory uses [Conda](https://docs.conda.io/) to manage dependencies.
It trains a linear regression model to predict the Fear & Greed Index using the
preprocessed data in `../data/processed/fear_and_greed_history_5min.parquet`.
The model weights and metadata are saved to the `../models/` directory as CSV and JSON files.

### Setup Environment

```bash
cd python_train
conda env create -f environment.yml  # Only needed once
conda activate btc_predictor
```

### Run Training (from notebook)

The main workflow is in the notebook. Open and run:

```bash
jupyter notebook linear_regression_training.ipynb
# or in VS Code, open the notebook and run all cells
```

### Run Python Tests

```bash
pytest
```

### Model Artifacts

- Model weights: `../models/champion_model.csv` (and backups/challengers)
- Model metadata: `../models/model_metadata.json`
- The notebook and model files are auto-committed by the CI/CD pipeline after each run.

### Inference

To use the trained model for inference, read the weights from `../models/champion_model.csv` and apply the linear regression formula:

```
prediction = intercept + btc_price_weight * btc_price
```

### Data

- Input: `../data/processed/fear_and_greed_history_5min.parquet`
- Output: Model weights and metadata in `../models/`

### CI/CD

- The pipeline fetches new data, retrains the model, and commits updated models and notebook automatically.
- See `.github/workflows/` for details.

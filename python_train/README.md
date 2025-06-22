# gha-ml-pipeline

This project contains utilities for fetching and processing crypto data and a simple Python training project.

## Python Training

The `python_train` directory uses [Conda](https://docs.conda.io/) to manage dependencies.
It trains a linear regression model to predict the Bitcoin closing price using the
preprocessed data in `data/processed/fear_and_greed_history_5min.parquet`.
The model weights are saved to `./models/model_v1.csv`.

### Setup Environment

```bash
cd python_train
conda env create -f environment.yml
conda activate btc_predictor
```

### Run Training

```bash
python src/train.py
```

### Run Python Tests

```bash
pytest
```

### Run the Notebook

You can open `analysis.ipynb` in VS Code or Jupyter after activating the environment.
**Make sure to use the `btc_predictor` Conda environment when running the notebook** so all dependencies are available.

If using Jupyter, you may need to install the kernel once:
```bash
python -m ipykernel install --user --name btc_predictor --display-name "Python (btc_predictor)"
```
Then select the "Python (btc_predictor)" kernel in Jupyter or VS Code.

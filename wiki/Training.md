# Model Training

The Python code under [`python_train/`](../python_train/) trains a simple linear regression model using `polars` and `scikit-learn`.

- The notebook `linear_regression_training.ipynb` executes the workflow.
- Model weights are written to the [`models/`](../models/) directory and tracked in git.
- Tests for utility functions live in `python_train/tests/`.

Training is automated by `.github/workflows/train_model.yml`, which runs the notebook in a Conda environment and commits updated weights.

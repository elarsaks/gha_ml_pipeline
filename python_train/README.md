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
   poetry run python src/models/train_model.py \
     --input ../data/processed \
     --output weights/weights.csv
   ```
3. The CSV file in `model_training/weights/weights.csv` contains the learned `ts_coef` and `intercept`.

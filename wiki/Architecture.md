# Architecture

The pipeline consists of several components working together:

1. **Rust data tools** in `rust_fetch/` fetch raw Bitcoin data and convert it to Parquet.
2. **Python training code** in `python_train/` trains a linear regression model on the processed dataset.
3. **React client** in `react_client/` visualizes price history and predictions.
4. **GitHub Actions workflows** orchestrate fetching, training and deployment.

The folder structure is described in the [project README](../README.md#project-structure).

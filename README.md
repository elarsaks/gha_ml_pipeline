# gha-ml-pipeline
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

<img src="https://repository-images.githubusercontent.com/1006038998/c4d24540-64b5-443d-85d5-1920e5267e91" alt="gha_ml_pipeline Social Preview" style="display:block;width:100%;max-width:100vw;margin:0;padding:0;border:0;">

## Overview
This repository is a hobby project that implements a complete machine learning pipeline for Bitcoin price prediction. Everything runs inside GitHub Actions and all data and models live directly in this repository. The goal is to learn and demonstrate an end‑to‑end ML workflow without relying on expensive cloud services or paid APIs.

The pipeline covers data collection, model training, analysis and visualisation. It uses a mix of Rust, Python and TypeScript with CI/CD provided by GitHub Actions.

## Main components
- **CI/CD**: GitHub Actions orchestrate fetching, training and deployment.
- **Rust backend** (`rust_fetch/`): binaries for fetching historical data and converting it to Parquet files.
- **Python ML pipeline** (`python_train/`): Conda‑based environment for training and evaluating models.
- **React front‑end** (`react_client/`): simple UI to visualize the final prediction. The latest version is always deployed at [elarsaks.github.io/gha_ml_pipeline](https://elarsaks.github.io/gha_ml_pipeline/).


## Project structure
```
/ data/            Raw and processed datasets
/ models/          Trained model weights and metadata
/ rust_fetch/      Rust data ingestion tools
/ python_train/    Python ML code and notebooks
/ react_client/    React + TypeScript front‑end
```

## Installation
For setup and usage instructions, see the README in each subdirectory:
- [rust_fetch/README.md](rust_fetch/README.md)
- [python_train/README.md](python_train/README.md)
- [react_client/README.md](react_client/README.md)
- [.github/workflows/README.md](.github/workflows/README.md)

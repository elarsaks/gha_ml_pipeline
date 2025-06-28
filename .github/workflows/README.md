# GitHub Workflows for gha-ml-pipeline

This folder contains the CI/CD workflows that orchestrate the end-to-end ML pipeline, including data fetching, model training, and frontend deployment. All workflows are defined as YAML files and run in GitHub Actions.

## Main Workflows
- **ml_pipeline.yml**: Orchestrates the full pipeline (fetch, train, deploy) on a schedule or manually.
- **fetch_data.yml**: Fetches and stores new data from the API.
- **train_model.yml**: Trains and evaluates the ML model.
- **deploy_react_client.yml**: Builds and deploys the React frontend to GitHub Pages.

## Running Workflows Locally
You can use [`act`](https://github.com/nektos/act) to run most workflows locally for testing and development.

### Prerequisites
- Install [Docker](https://docs.docker.com/get-docker/)
- Install [`act`](https://github.com/nektos/act)

### Example Commands

Run the full pipeline (as in `ml_pipeline.yml`):
```sh
act -j fetch
act -j train
act -j deploy
```

Or run a specific workflow job:
```sh
act -j fetch         # Run data fetching
act -j train         # Run model training
act -j deploy        # Run frontend deployment
```

> Note: Some jobs may require secrets or environment variables. See the workflow YAML files for details.

## More Info
- For details on the data fetching, see [../rust_fetch/README.md](../rust_fetch/README.md)
- For model training, see [../python_train/README.md](../python_train/README.md)
- For the frontend, see [../react_client/README.md](../react_client/README.md)

---

For a high-level overview, see the [project root README](../README.md).

# CI/CD Workflows

GitHub Actions orchestrate the pipeline:

- `fetch_data.yml` builds the Rust tools and updates the dataset.
- `train_model.yml` runs the training notebook and commits new weights.
- `deploy_react_client.yml` deploys the React app to GitHub Pages.
- `ml_pipeline.yml` ties everything together on a schedule or manual trigger.

See the [workflows README](../.github/workflows/README.md) for local testing with `act`.

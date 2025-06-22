# GitHub Workflows

This folder contains the CI/CD workflows for the project.

## Workflows

- **ci-cd.yml**  
  Runs Rust and Python tests on every push.  
  - Rust: builds and tests the code in `rust_fetch/`
  - Python: sets up a Conda environment from `python_train/environment.yml` and runs `pytest` in `python_train/`

## Usage

Workflows are triggered automatically on push.  
You can also run individual jobs locally using [act](https://github.com/nektos/act):

```bash
# From the project root
act -j python-test
act -j rust-test
```

## Notes

- Make sure to update the workflow files if you change the project structure or environment files.
- For Apple Silicon users, you may need to run act with `--container-architecture linux/amd64`.

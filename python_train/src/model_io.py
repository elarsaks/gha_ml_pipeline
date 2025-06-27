import json
import shutil
from pathlib import Path


def save_model(weights_df, mse, models_dir_path):
    """
    Save model weights and metadata, manage champion/challenger logic.
    """
    from datetime import datetime

    models_dir = Path(models_dir_path)
    models_dir.mkdir(exist_ok=True)
    model_metadata = {"version": datetime.now().strftime("%Y%m%d_%H%M%S"), "mse": mse}
    model_metadata_path = models_dir / "model_metadata.json"
    if model_metadata_path.exists():
        with open(model_metadata_path, "r") as f:
            champion_metadata = json.load(f)
        if mse < champion_metadata["mse"]:
            # Backup previous champion model
            shutil.copy(models_dir / "champion_model.csv", models_dir / f"backup_{champion_metadata['version']}.csv")
            # Save new champion model
            weights_df.write_csv(models_dir / "champion_model.csv")
            # Update metadata
            with open(model_metadata_path, "w") as f:
                json.dump(model_metadata, f)
            return "New champion model saved."
        else:
            weights_df.write_csv(models_dir / f"challenger_{model_metadata['version']}.csv")
            return "Challenger model saved (not champion)."
    else:
        weights_df.write_csv(models_dir / "champion_model.csv")
        with open(model_metadata_path, "w") as f:
            json.dump(model_metadata, f)
        return "First champion model saved."

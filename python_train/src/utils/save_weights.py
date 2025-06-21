import csv
import os


def save_weights(weights: dict, output_path: str) -> None:
    """
    Save weights (dictionary of name->value) to a CSV file.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["parameter", "value"])
        for param, value in weights.items():
            writer.writerow([param, value])

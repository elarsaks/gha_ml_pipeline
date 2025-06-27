import os
import sys
import tempfile

import polars as pl

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))
from model_io import save_model


def test_save_model_creates_champion():
    with tempfile.TemporaryDirectory() as tmpdir:
        weights_df = pl.DataFrame({"feature": ["intercept", "btc_price"], "weight": [1.0, 2.0]})
        msg = save_model(weights_df, 0.5, tmpdir)
        assert "champion" in msg
        assert os.path.exists(os.path.join(tmpdir, "champion_model.csv"))
        assert os.path.exists(os.path.join(tmpdir, "model_metadata.json"))


def test_save_model_challenger():
    with tempfile.TemporaryDirectory() as tmpdir:
        weights_df = pl.DataFrame({"feature": ["intercept", "btc_price"], "weight": [1.0, 2.0]})
        # First champion
        save_model(weights_df, 0.5, tmpdir)
        # Challenger with worse MSE
        msg = save_model(weights_df, 1.0, tmpdir)
        assert "Challenger" in msg
        # Challenger with better MSE
        msg2 = save_model(weights_df, 0.1, tmpdir)
        assert "champion" in msg2

import joblib
import os
from config import config
from utils.logger import logger

_models = {}

def _is_lfs_pointer(path):
    try:
        with open(path, "rb") as fh:
            return fh.read(64).startswith(b"version https://git-lfs.github.com/spec/v1")
    except OSError:
        return False

def _load_model(model_name, path, success_message, missing_message):
    if not os.path.exists(path):
        logger.warning(missing_message)
        return None

    if _is_lfs_pointer(path):
        logger.error(f"{model_name} file is a Git LFS pointer, not the actual model payload: {path}")
        return None

    try:
        model = joblib.load(path)
        logger.info(success_message)
        return model
    except Exception as exc:
        logger.error(f"Error loading {model_name}: {exc}")
        return None

def load_all_models():
    """Loads all models into memory at startup."""
    _models['random_forest'] = _load_model(
        "primary model",
        config.MODEL_PATH,
        f"Successfully loaded primary model: {config.MODEL_PATH}",
        f"Primary model not found at {config.MODEL_PATH}",
    )

    _models['lightgbm'] = _load_model(
        "simulation model",
        config.LGBM_SCENARIO_MODEL_PATH,
        f"Loaded simulation model: {config.LGBM_SCENARIO_MODEL_PATH}",
        f"Simulation model not found at {config.LGBM_SCENARIO_MODEL_PATH}",
    )

    _models['prophet'] = _load_model(
        "forecast model",
        config.PROPHET_MODEL_PATH,
        f"Loaded forecast model: {config.PROPHET_MODEL_PATH}",
        f"Forecast model not found at {config.PROPHET_MODEL_PATH}",
    )

    _models['isolation_forest'] = _load_model(
        "anomaly model",
        config.ISOLATION_FOREST_MODEL_PATH,
        f"Loaded anomaly model: {config.ISOLATION_FOREST_MODEL_PATH}",
        f"Anomaly model not found at {config.ISOLATION_FOREST_MODEL_PATH}",
    )

def get_model(name):
    """Retrieve a loaded model by name."""
    return _models.get(name)

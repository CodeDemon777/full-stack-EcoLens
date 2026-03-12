import joblib
import os
from config import config
from utils.logger import logger

_models = {}

def load_all_models():
    """Loads all models into memory at startup."""
    # Main Random Forest Model
    try:
        _models['random_forest'] = joblib.load(config.MODEL_PATH)
        logger.info(f"Successfully loaded primary model: {config.MODEL_PATH}")
    except FileNotFoundError:
        logger.error(f"Primary model not found at {config.MODEL_PATH}")
        _models['random_forest'] = None

    # LightGBM Simulation Model
    try:
        if os.path.exists(config.LGBM_SCENARIO_MODEL_PATH):
            _models['lightgbm'] = joblib.load(config.LGBM_SCENARIO_MODEL_PATH)
            logger.info(f"Loaded simulation model: {config.LGBM_SCENARIO_MODEL_PATH}")
        else:
            logger.warning(f"Simulation model not found at {config.LGBM_SCENARIO_MODEL_PATH}")
            _models['lightgbm'] = None
    except Exception as e:
        logger.error(f"Error loading simulation model: {str(e)}")
        _models['lightgbm'] = None

    # Prophet Forecasting Model
    try:
        if os.path.exists(config.PROPHET_MODEL_PATH):
            _models['prophet'] = joblib.load(config.PROPHET_MODEL_PATH)
            logger.info(f"Loaded forecast model: {config.PROPHET_MODEL_PATH}")
        else:
            logger.warning(f"Forecast model not found at {config.PROPHET_MODEL_PATH}")
            _models['prophet'] = None
    except Exception as e:
        logger.error(f"Error loading forecast model: {str(e)}")
        _models['prophet'] = None

    # Isolation Forest Anomaly Detection Model
    try:
        if os.path.exists(config.ISOLATION_FOREST_MODEL_PATH):
            _models['isolation_forest'] = joblib.load(config.ISOLATION_FOREST_MODEL_PATH)
            logger.info(f"Loaded anomaly model: {config.ISOLATION_FOREST_MODEL_PATH}")
        else:
            logger.warning(f"Anomaly model not found at {config.ISOLATION_FOREST_MODEL_PATH}")
            _models['isolation_forest'] = None
    except Exception as e:
        logger.error(f"Error loading anomaly model: {str(e)}")
        _models['isolation_forest'] = None

def get_model(name):
    """Retrieve a loaded model by name."""
    return _models.get(name)

import numpy as np
import pandas as pd
from utils.logger import logger

PREDICT_FEATURE_ORDER = [
    'population', 
    'gdp', 
    'primary_energy_consumption', 
    'energy_per_capita', 
    'energy_per_gdp'
]

ANOMALY_FEATURE_ORDER = [
    'co2',
    'energy_per_capita',
    'primary_energy_consumption',
    'population',
    'gdp'
]

def validate_features(data, feature_list):
    """Validates that all expected features are present in the JSON data."""
    missing_features = [f for f in feature_list if f not in data]
    if missing_features:
        raise ValueError(f"Missing required features: {missing_features}")

def preprocess(data, is_anomaly=False):
    """Preprocesses input JSON request object into a model-ready NumPy array as a DataFrame."""
    feature_list = ANOMALY_FEATURE_ORDER if is_anomaly else PREDICT_FEATURE_ORDER
    validate_features(data, feature_list)
    
    # Extract features in the EXACT order defined by the training data
    feature_values = []
    for f in feature_list:
         try:
            val = float(data[f])
            feature_values.append(val)
         except (ValueError, TypeError):
            raise ValueError(f"Feature {f} must be numeric, got {data.get(f)}")
            
    # Reshape for single prediction shape (1, n)
    arr = np.array(feature_values).reshape(1, -1)
    
    # Convert back to DataFrame as many Scikit-learn models expect column names
    df = pd.DataFrame(arr, columns=feature_list)
    return df

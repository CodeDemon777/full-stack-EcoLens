from models.model_loader import get_model
from utils.preprocessor import preprocess
from utils.logger import logger

def detect_anomaly(features_dict):
    model = get_model('isolation_forest')
    
    if model is None:
        logger.warning("No Isolation Forest model loaded. Defaulting anomaly to false.")
        return {
            "is_anomaly": False,
            "anomaly_score": 0.0,
            "message": "Anomaly detection model not available."
        }
        
    try:
        X = preprocess(features_dict, is_anomaly=True)
    except Exception as e:
        logger.error(f"Anomaly detection preprocessing error: {str(e)}")
        raise e

    prediction = model.predict(X)[0] # IsolationForest outputs -1 for anomalous, 1 for normal
    score = model.decision_function(X)[0] # get raw score
    
    is_anomaly = True if prediction == -1 else False
    
    return {
        "is_anomaly": bool(is_anomaly),
        "anomaly_score": float(score),
        "message": "Unusual input values detected by Isolation Forest" if is_anomaly else "Input values appear normal"
    }

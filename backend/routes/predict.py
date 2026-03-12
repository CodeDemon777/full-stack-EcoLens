from flask import Blueprint, request
from models.predictor import get_prediction
from models.anomaly import detect_anomaly
from utils.response import success_response, error_response
from utils.logger import logger

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return error_response("No JSON payload provided", 400)
            
        logger.info("Received prediction request")
        
        prediction_result = get_prediction(data)
        
        # Anomaly model expects 'co2' as an input feature (the predicted value usually)
        anomaly_data = {**data, 'co2': prediction_result['carbon_footprint']}
        anomaly_result = detect_anomaly(anomaly_data)
        
        # Combine results
        return success_response({
            **prediction_result,
            "anomaly": anomaly_result
        })
    except ValueError as val_err:
        logger.warning(f"Validation Error: {str(val_err)}")
        return error_response(str(val_err), 400)
    except Exception as e:
        logger.error(f"Internal Server Error in /predict: {str(e)}")
        return error_response("An internal error occurred during prediction.", 500)

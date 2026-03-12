from flask import Blueprint
from datetime import datetime, timezone
from models.model_loader import get_model
from utils.response import success_response

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    rf_model = get_model('random_forest')
    
    components = {
        "random_forest": get_model('random_forest') is not None,
        "lightgbm": get_model('lightgbm') is not None,
        "prophet": get_model('prophet') is not None,
        "isolation_forest": get_model('isolation_forest') is not None
    }
    
    return success_response({
        "status": "ok",
        "model_loaded": rf_model is not None,
        "models_available": [k for k, v in components.items() if v],
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

from flask import Blueprint, request
from models.simulator import run_simulation
from utils.response import success_response, error_response
from utils.logger import logger

simulate_bp = Blueprint('simulate', __name__)

@simulate_bp.route('/simulate', methods=['POST'])
def simulate():
    try:
        data = request.get_json()
        if not data:
            return error_response("No JSON payload provided", 400)
            
        base_features = data.get('base_features')
        scenario_overrides = data.get('scenario_overrides')
        
        if not base_features or not scenario_overrides:
            return error_response("Both 'base_features' and 'scenario_overrides' must be provided", 400)
            
        logger.info("Received simulation request")
        
        simulation_result = run_simulation(base_features, scenario_overrides)
        return success_response(simulation_result)
        
    except ValueError as val_err:
        logger.warning(f"Validation Error: {str(val_err)}")
        return error_response(str(val_err), 400)
    except Exception as e:
        logger.error(f"Internal Server Error in /simulate: {str(e)}")
        return error_response("An internal error occurred during simulation.", 500)

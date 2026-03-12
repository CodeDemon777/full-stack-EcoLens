from flask import Blueprint, request
from models.forecaster import run_forecast
from utils.response import success_response, error_response
from utils.logger import logger

forecast_bp = Blueprint('forecast', __name__)

@forecast_bp.route('/forecast', methods=['POST'])
def forecast():
    try:
        data = request.get_json()
        if not data:
            return error_response("No JSON payload provided", 400)
            
        country = data.get('country')
        start_year = data.get('start_year')
        end_year = data.get('end_year')
        
        if not country or not start_year or not end_year:
            return error_response("Missing required fields: country, start_year, end_year", 400)
            
        logger.info(f"Received forecast request for {country} ({start_year}-{end_year})")
        
        prediction_list = run_forecast(country, int(start_year), int(end_year))
        return success_response(prediction_list)
        
    except ValueError as val_err:
        logger.warning(f"Validation Error: {str(val_err)}")
        return error_response(str(val_err), 400)
    except FileNotFoundError as fnf_err:
        logger.error(f"Missing data file: {str(fnf_err)}")
        return error_response(str(fnf_err), 500)
    except Exception as e:
        logger.error(f"Internal Server Error in /forecast: {str(e)}")
        return error_response("An internal error occurred during forecasting.", 500)

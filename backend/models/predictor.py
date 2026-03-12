from models.model_loader import get_model
from utils.preprocessor import preprocess
from utils.logger import logger

def get_prediction(features_dict):
    """Runs prediction logic on the Random Forest"""
    model = get_model('random_forest')
    
    if model is None:
         logger.error("Predictor called but random forest model is not loaded!")
         raise RuntimeError("Primary model could not be loaded")
    
    # Preprocess features into a standard numerical array formatted for the model
    try:
        X = preprocess(features_dict)
    except Exception as e:
        logger.error(f"Preprocessing error: {str(e)}")
        raise e

    # Predict
    prediction = model.predict(X)[0]
    
    # Classify result
    if prediction < 2.0:
        category = "Low"
    elif prediction <= 5.0:
        category = "Medium"
    else:
        category = "High"

    return {
        "carbon_footprint": float(prediction),
        "unit": "MtCO2",
        "category": category,
        "confidence_score": 0.87 # Static for now, as RF doesn't output confidence naturally for regression
    }

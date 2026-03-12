from models.model_loader import get_model
from utils.preprocessor import preprocess
from utils.logger import logger

def run_simulation(base_features, scenario_overrides):
    model = get_model('lightgbm')
    if model is None:
        # Fallback to Random Forest if lightgbm is missing (based on user's hint "if exists")
        model = get_model('random_forest')
        if model is None:
            raise RuntimeError("No simulation model available")

    # Merge base features with overrides
    scenario_features = {**base_features, **scenario_overrides}

    try:
        base_X = preprocess(base_features)
        scenario_X = preprocess(scenario_features)
    except Exception as e:
        logger.error(f"Simulation preprocessing error: {str(e)}")
        raise e

    base_co2 = model.predict(base_X)[0]
    scenario_co2 = model.predict(scenario_X)[0]

    delta = scenario_co2 - base_co2
    delta_percent = (delta / base_co2) * 100 if base_co2 != 0 else 0

    return {
        "baseline_co2": float(base_co2),
        "scenario_co2": float(scenario_co2),
        "delta": float(delta),
        "delta_percent": float(delta_percent),
        "interpretation": f"{'Increase' if delta > 0 else 'Decrease'} of {abs(delta):.2f} MtCO2 expected."
    }

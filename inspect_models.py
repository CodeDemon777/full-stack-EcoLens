import joblib

models = [
    "overall_carbon_rf_model.pkl",
    "policy_simulation_model.pkl",
    "prophet_co2_model.pkl",
    "scope_anomaly_model.pkl",
    "energy_intensity_model.pkl"
]

with open("inspect_models_utf8.txt", "w", encoding="utf-8") as f:
    for m in models:
        try:
            model = joblib.load(f"backend/{m}")
            f.write(f"--- {m} ---\n")
            if hasattr(model, "feature_names_in_"):
                f.write(f"Features: {list(model.feature_names_in_)}\n")
                f.write(f"Count: {len(model.feature_names_in_)}\n")
            else:
                f.write("No feature_names_in_ attribute\n")
        except Exception as e:
            f.write(f"Could not load {m}: {e}\n")

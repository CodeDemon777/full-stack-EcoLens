import requests
import json

base_url = "http://127.0.0.1:5000/api"

predict_payload = {
    "population": 1400000000,
    "gdp": 3000000000000,
    "primary_energy_consumption": 35000,
    "energy_per_capita": 25000,
    "energy_per_gdp": 1.5
}

print("Testing /predict...")
try:
    res = requests.post(f"{base_url}/predict", json=predict_payload)
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print(f"Prediction failed: {e}")

simulate_payload = {
    "base_features": predict_payload,
    "scenario_overrides": {
        "gdp": 3500000000000,
        "primary_energy_consumption": 40000,
        "energy_per_capita": 28000
    }
}

print("\nTesting /simulate...")
try:
    res = requests.post(f"{base_url}/simulate", json=simulate_payload)
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print(f"Simulation failed: {e}")

forecast_payload = {
    "country": "India",
    "start_year": 2024,
    "end_year": 2030
}

print("\nTesting /forecast...")
try:
    res = requests.post(f"{base_url}/forecast", json=forecast_payload)
    print("Forecast Success!" if res.json().get('success') else res.json())
except Exception as e:
    print(f"Forecast failed: {e}")

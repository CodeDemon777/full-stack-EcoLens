from pathlib import Path

LOCAL_DEV_HOSTS = ("localhost", "127.0.0.1")
LOCAL_DEV_PORTS = (3000, 5173, 8080, 8081)


class Config:
    BASE_DIR = Path(__file__).resolve().parent
    MODEL_PATH = BASE_DIR / "overall_carbon_rf_model.pkl"
    LGBM_SCENARIO_MODEL_PATH = BASE_DIR / "policy_simulation_model.pkl"
    PROPHET_MODEL_PATH = BASE_DIR / "prophet_co2_model.pkl"
    ISOLATION_FOREST_MODEL_PATH = BASE_DIR / "scope_anomaly_model.pkl"

    DATA_PATH = BASE_DIR / "data"
    LOGS_PATH = BASE_DIR / "logs"
    DEBUG = True
    HOST = "0.0.0.0"
    PORT = 5000
    CORS_ORIGINS = [
        f"http://{host}:{port}"
        for host in LOCAL_DEV_HOSTS
        for port in LOCAL_DEV_PORTS
    ]


config = Config()

import os
from pathlib import Path
from urllib.parse import urlsplit

LOCAL_DEV_HOSTS = ("localhost", "127.0.0.1")
LOCAL_DEV_PORTS = (3000, 5173, 8080, 8081)

def _get_bool(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}

def _get_int(name, default):
    value = os.getenv(name)
    if value is None:
        return default

    try:
        return int(value)
    except ValueError:
        return default

def _get_cors_origins():
    raw_origins = os.getenv("CORS_ORIGINS")
    if raw_origins:
        raw_origins = raw_origins.strip()
        if raw_origins == "*":
            return "*"

        normalized_origins = []
        seen = set()

        for origin in raw_origins.split(","):
            candidate = origin.strip().rstrip("/")
            if not candidate:
                continue

            parsed = urlsplit(candidate)
            # CORS accepts origins only (scheme + host + optional port), not URL paths.
            if parsed.scheme and parsed.netloc:
                normalized = f"{parsed.scheme}://{parsed.netloc}"
            else:
                normalized = candidate

            if normalized not in seen:
                seen.add(normalized)
                normalized_origins.append(normalized)

        return normalized_origins

    return [
        f"http://{host}:{port}"
        for host in LOCAL_DEV_HOSTS
        for port in LOCAL_DEV_PORTS
    ]


class Config:
    BASE_DIR = Path(__file__).resolve().parent
    PROJECT_ROOT = BASE_DIR.parent
    MODEL_PATH = BASE_DIR / "overall_carbon_rf_model.pkl"
    LGBM_SCENARIO_MODEL_PATH = BASE_DIR / "policy_simulation_model.pkl"
    PROPHET_MODEL_PATH = BASE_DIR / "prophet_co2_model.pkl"
    ISOLATION_FOREST_MODEL_PATH = BASE_DIR / "scope_anomaly_model.pkl"

    DATA_PATH = BASE_DIR / "data"
    LOGS_PATH = BASE_DIR / "logs"
    FRONTEND_DIST = Path(
        os.getenv("FRONTEND_DIST", str(PROJECT_ROOT / "dist"))
    ).resolve()
    DEBUG = _get_bool("DEBUG", False)
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = _get_int("PORT", 5000)
    WAITRESS_THREADS = _get_int("WAITRESS_THREADS", 8)
    SERVE_FRONTEND = _get_bool("SERVE_FRONTEND", True)
    CORS_ORIGINS = _get_cors_origins()


config = Config()

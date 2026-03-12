from config import config
from wsgi import app

try:
    from waitress import serve
except ImportError as exc:
    raise SystemExit(
        "waitress is required for production runs. Install backend/requirements.txt first."
    ) from exc


if __name__ == "__main__":
    serve(
        app,
        host=config.HOST,
        port=config.PORT,
        threads=config.WAITRESS_THREADS,
    )

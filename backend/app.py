from pathlib import Path
from flask import Flask, abort, send_from_directory
from flask_cors import CORS
from config import config

def _register_frontend_routes(app):
    dist_dir = Path(config.FRONTEND_DIST).resolve()
    index_file = dist_dir / "index.html"

    if not config.SERVE_FRONTEND or not index_file.exists():
        return

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        if path.startswith("api/"):
            abort(404)

        requested_path = (dist_dir / path).resolve()
        if (
            path
            and requested_path.is_file()
            and requested_path.is_relative_to(dist_dir)
        ):
            return send_from_directory(dist_dir, path)

        return send_from_directory(dist_dir, "index.html")

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": config.CORS_ORIGINS}})
    app.config["JSON_SORT_KEYS"] = False

    # Import and register blueprints
    from routes.predict import predict_bp
    from routes.simulate import simulate_bp
    from routes.forecast import forecast_bp
    from routes.health import health_bp
    from routes.organization import organization_bp

    app.register_blueprint(predict_bp, url_prefix='/api')
    app.register_blueprint(simulate_bp, url_prefix='/api')
    app.register_blueprint(forecast_bp, url_prefix='/api')
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(organization_bp, url_prefix='/api')

    # Load models on startup
    from models.model_loader import load_all_models
    load_all_models()
    _register_frontend_routes(app)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host=config.HOST,
        port=config.PORT,
        debug=config.DEBUG,
        use_reloader=False,
    )

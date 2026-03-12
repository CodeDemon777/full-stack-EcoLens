from flask import Flask
from flask_cors import CORS
from config import config
import os

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": config.CORS_ORIGINS}})

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

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG, use_reloader=False)

from config import Config
from flask import Flask


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    from rest import bp as rest_bp
    app.register_blueprint(rest_bp)

    return app


if __name__ == '__main__':
    app = create_app(Config)
    app.run(host="0.0.0.0", port=5000, debug=Config.flask_debug)

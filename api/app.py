import os

from flask import Flask

from config import Config
from core.rest import Actions, Blueprints, DataSource, Document as DocumentBlueprint, Explorer, Index, System, Entity


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    app.register_blueprint(DocumentBlueprint.blueprint)
    app.register_blueprint(Explorer.blueprint)
    app.register_blueprint(DataSource.blueprint)
    app.register_blueprint(Index.blueprint)
    app.register_blueprint(System.blueprint)
    app.register_blueprint(Actions.blueprint)
    app.register_blueprint(Blueprints.blueprint)
    app.register_blueprint(Entity.blueprint)
    app.secret_key = os.urandom(64)
    return app


app = create_app(Config)

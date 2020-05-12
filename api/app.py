import os

from flask import Flask
from utils.package_import import import_package

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


@app.cli.command()
def remove_application():
    from core.service.document_service import explorer_api
    from dmss_api.exceptions import ApiException

    try:
        explorer_api.remove_by_path(Config.APPLICATION_DATA_SOURCE, {"directory": "DMT"})
    except ApiException:
        pass


@app.cli.command()
def init_application():
    for folder in Config.SYSTEM_FOLDERS:
        import_package(f"{Config.APPLICATION_HOME}/core/{folder}", is_root=True)

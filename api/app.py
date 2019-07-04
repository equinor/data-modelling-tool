import json

from flask import Flask

from config import Config
from rest import create_api
from services.database import db
from utils.debugging import enable_remote_debugging
from utils.files import getListOfFiles


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    create_api(app)
    return app


if Config.REMOTE_DEBUG == '1' or Config.REMOTE_DEBUG == 'True':
    enable_remote_debugging()

app = create_app(Config)


@app.cli.command()
def init_import():
    for file in getListOfFiles('/code/models'):
        id = file.split('/', 3)[-1]
        print(f'Importing {file} as schema with id: {id}.')
        with open(file) as json_file:
            document = json.load(json_file)
            document['_id'] = id
            db.documents.replace_one({'_id': id}, document, upsert=True)

import json

from flask import Flask

from config import Config
from rest import create_api
from services.database import model_db, data_modelling_tool_db
from utils.debugging import enable_remote_debugging
from utils.files import getListOfFiles


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    create_api(app)
    return app


if Config.REMOTE_DEBUG in (1, 'True', '1', True):
    enable_remote_debugging()

app = create_app(Config)


@app.cli.command()
def init_import():
    import_file_dict = {
        "documents": getListOfFiles('/code/schemas/documents'),
        "templates": getListOfFiles('/code/schemas/templates'),
        "data_sources": getListOfFiles('/code/schemas/data-sources'),
    }

    for collection, file_list in import_file_dict.items():
        for file in file_list:
                id = file.split('/', 4)[-1]
                print(f'Importing {file} as {collection} with id: {id}.')
                with open(file) as json_file:
                    document = json.load(json_file)

                    if collection == 'documents':
                        document['_id'] = id
                        model_db[f'{collection}'].replace_one({'_id': id}, document, upsert=True)
                    if collection == 'data_sources':
                        data_modelling_tool_db[f'{collection}'].insert_one(document=document)
                    else:
                        document['_id'] = id
                        data_modelling_tool_db[f'{collection}'].replace_one({'_id': id}, document, upsert=True)

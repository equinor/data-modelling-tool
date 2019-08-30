from flask_restful import Api

from rest.data_source_consumers.packages import Packages
from rest.data_sources import DataSources, SingleDataSource
from rest.data_source_consumers.document import Document
from rest.data_source_consumers.document_to_schema import DocumentToSchema
from rest.data_source_consumers.index import Index
from rest.template import Template
from rest.transformer import Transformer


def create_api(app):
    api = Api(app)
    api.add_resource(Transformer, "/api/transformer/json-schema")
    api.add_resource(Index, "/api/index/<string:data_source_id>")

    api.add_resource(Packages, "/api/data-sources/<string:data_source_id>/packages")

    api.add_resource(SingleDataSource, "/api/data-sources/<string:_id>")
    api.add_resource(DataSources, "/api/data-sources/<string:document_type>")

    api.add_resource(Document, "/api/data-sources/<string:data_source_id>/<path:form_id>")
    api.add_resource(DocumentToSchema, "/api/data-sources/<string:data_source_id>/<path:form_id>/json-schema")

    api.add_resource(Template, "/api/templates/<path:_id>")

    return app

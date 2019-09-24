from flask_restful import Api

from rest.data_source_consumers.document import Document

# from rest.data_source_consumers.document_with_template import DocumentWithTemplate

# from rest.data_source_consumers.index import Index
from rest.data_source_consumers.packages import Packages
from rest.data_sources import DataSource
from rest.template import Template


def create_api(app):
    api = Api(app)

    # Get document as formData with it's template as json-schema
    # api.add_resource(DocumentWithTemplate, "/api/document-template/<path:absolute_document_id>")

    # Create and Delete packages and files
    # api.add_resource(Packages, "/api/v1/data-sources/<string:data_source_id>/packages")

    # Get the index of files in a data-source
    # api.add_resource(Index, "/api/index/<string:data_source_id>")

    # Get a list of all data-sources
    # api.add_resource(DataSources, "/api/v1/data-sources/<string:document_type>")

    # Get and Update a single document
    api.add_resource(Document, "/api/v1/data-sources/<string:data_source_id>/<path:form_id>")

    # Get DMT-templates
    api.add_resource(Template, "/api/v1/templates/<path:id>")

    # Create, update, or delete a  single data-source, or GET all
    api.add_resource(DataSource, "/api/data-sources/<string:id>", "/api/data-sources")
    # Create, update, or delete a data-source
    # api.add_resource(SingleDataSource, "/api/data-sources/<string:id>", "/api/data-sources")

    # Not currently used by front end
    # api.add_resource(Transformer, "/api/transformer/json-schema")
    # api.add_resource(DocumentToSchema, "/api/v1/data-sources/<string:data_source_id>/<path:form_id>/json-schema")

    return app

from flask_restful import Resource, abort

from classes.data_source import DataSource
from config import Config
from utils.schema_tools.form_to_schema import form_to_schema
from services.database import data_modelling_tool_db


class DocumentWithTemplate(Resource):
    # TODO: Proper validation
    @staticmethod
    def get(absolute_document_id):
        # Up to first occurrence of "/" is the data-source ID
        document_data_source_id = absolute_document_id.split("/", 1)[0]
        # Rest is the document ID
        document_id = absolute_document_id.split("/", 1)[1]

        document_data_source = DataSource(id=document_data_source_id)
        document = document_data_source.client.read_form(_id=document_id)

        template_id = document["meta"].get("templateRef", None)
        if not template_id:
            abort(403, message="The requested document does not contain a template referance")

        template_data_source_id = template_id.split("/", 1)[0]

        # If the templateRef is a Data-modelling-tool template, get it from the DMT database
        if template_data_source_id == Config.TEMPLATES_COLLECTION:
            dmt_template_id = template_id.split("/")[-1]
            dmt_template = data_modelling_tool_db[Config.TEMPLATES_COLLECTION].find_one(
                filter={"_id": dmt_template_id}
            )
            # DMT-templates are stored as json-schema, and does not require formData-to-json-schema transformation
            document["template"] = dmt_template["schema"]
            document["view"] = dmt_template.get("view", "")
            document["uiSchema"] = dmt_template.get("uiSchema", "")
        else:
            # Dynamically created documents are saved as formData, and will be transformed to json-schema
            template_data_source = DataSource(id=template_data_source_id)
            template_data_form = template_data_source.client.read_form(_id=template_id)["formData"]
            document["template"] = form_to_schema(template_data_form)

        return document

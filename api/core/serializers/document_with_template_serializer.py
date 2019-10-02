from flask_restful import fields

meta_fields = {"name": fields.String, "type": fields.String}

template_fields = {"meta": fields.Nested(meta_fields), "schema": fields.Raw, "uiSchema": fields.Raw}

document_fields = {"meta": fields.Nested(meta_fields)}

document_with_template_fields = {"template": fields.Raw, "document": fields.Raw}

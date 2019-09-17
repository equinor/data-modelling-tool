from core.domain.template import Template
from services.database import data_modelling_tool_db
from config import Config


def get_template_by_id(template_id: str) -> Template:
    dmt_template = data_modelling_tool_db[Config.TEMPLATES_COLLECTION].find_one(filter={"_id": template_id})
    return Template.from_dict(dmt_template)

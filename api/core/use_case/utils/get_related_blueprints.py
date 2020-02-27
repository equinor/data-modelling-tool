from typing import Dict

from classes.blueprint import Blueprint
from core.utility import BlueprintProvider


def get_related_blueprints(blueprint: str) -> Dict:
    related_blueprints = {}
    get_blueprint = BlueprintProvider().get_blueprint
    first = get_blueprint(blueprint)
    related_blueprints.update({blueprint: first.to_dict()})

    def get_blueprints_recursive(type: Blueprint):
        for attr in type.get_none_primitive_types():
            bp = get_blueprint(attr.attribute_type)
            related_blueprints.update({attr.attribute_type: bp.to_dict()})
            get_blueprints_recursive(bp)

    for attr in first.get_none_primitive_types():
        bp = get_blueprint(attr.attribute_type)
        related_blueprints.update({attr.attribute_type: bp.to_dict()})
        get_blueprints_recursive(bp)

    return related_blueprints

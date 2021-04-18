from typing import Dict

from domain_classes.blueprint import Blueprint
from utils.blueprint_provider import BlueprintProvider


def get_related_blueprints(blueprint: str) -> Dict:
    get_blueprint = BlueprintProvider().get_blueprint

    related_blueprints = {}

    first = get_blueprint(blueprint)
    related_blueprints[blueprint] = first.to_dict()

    def get_blueprints_recursive(type: Blueprint):
        for attr in type.get_none_primitive_types():
            bp = get_blueprint(attr.attribute_type)
            related_blueprints[attr.attribute_type] = bp.to_dict()
            if attr.attribute_type not in related_blueprints.keys():
                get_blueprints_recursive(bp)

    for attr in first.get_none_primitive_types():
        bp = get_blueprint(attr.attribute_type)
        related_blueprints[attr.attribute_type] = bp.to_dict()
        get_blueprints_recursive(bp)

    return related_blueprints

from typing import Dict

from classes.blueprint import Blueprint
from core.enums import SIMOS
from core.utility import BlueprintProvider


def get_related_blueprints(blueprint: str) -> Dict:
    get_blueprint = BlueprintProvider().get_blueprint

    related_blueprints = {}

    first = get_blueprint(blueprint)
    related_blueprints[blueprint] = first.to_dict()

    def get_blueprints_recursive(type: Blueprint):
        for attr in type.get_none_primitive_types():
            bp = get_blueprint(attr.attribute_type)
            related_blueprints[attr.attribute_type] = bp.to_dict()
            # This means it's a recursive Blueprint. Don't dig down...
            if bp != type:
                get_blueprints_recursive(bp)

    for attr in first.get_none_primitive_types():
        bp = get_blueprint(attr.attribute_type)
        related_blueprints[attr.attribute_type] = bp.to_dict()
        get_blueprints_recursive(bp)

    return related_blueprints

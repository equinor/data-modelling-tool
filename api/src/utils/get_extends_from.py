from typing import Set

from services.dmss import get_blueprint


def get_extends_from(blueprint_ref: str) -> Set[str]:
    """Takes a blueprint reference and return a set of all blueprints it inherits from (directly and indirectly"""
    blueprint = get_blueprint(blueprint_ref)
    inherited_extends = []
    for extend in blueprint["extends"]:
        inherited_extends += get_extends_from(extend)
    return set(blueprint["extends"] + inherited_extends)

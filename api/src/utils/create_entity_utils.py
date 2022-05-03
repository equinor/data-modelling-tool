import json
import string
from json import JSONDecodeError
from random import choices

from domain_classes.blueprint import Blueprint
from domain_classes.blueprint_attribute import BlueprintAttribute
from enums import BuiltinDataTypes, SIMOS, PRIMITIVES
from domain_classes.dto import DTO


def generate_name(type: str):
    name_of_type = type.split("/")[-1]
    lower_case_type_name = name_of_type.lower()
    # This random string generation is not used in a cryptographically manner, so disable bandit warning
    random_suffix = "".join(choices(string.ascii_lowercase + string.digits, k=4))  # nosec B311
    return f"{lower_case_type_name}-{random_suffix}"


class CreateEntityException(Exception):
    def __init__(self, message: str):
        super()
        self.message = message

    def __str__(self):
        return repr(self.message)


class InvalidDefaultValue(CreateEntityException):
    def __init__(self, attr: BlueprintAttribute, blueprint_name: str):
        super().__init__(message=f"blueprint: {blueprint_name}, attribute: {attr.name} has empty default value.")


class CreateEntity:
    def __init__(self, blueprint_provider, type: str, description: str, name: str = None):
        if type == BuiltinDataTypes.OBJECT.value:
            type = SIMOS.ENTITY.value
        self.name = name if name else generate_name(type)
        self.description = description
        self.type = type
        self.blueprint_provider = blueprint_provider
        self.attribute_types = self.blueprint_provider(SIMOS.ATTRIBUTE_TYPES.value)  # .to_dict()
        self.blueprint_attribute: Blueprint = self.blueprint_provider(SIMOS.BLUEPRINT_ATTRIBUTE.value)
        blueprint: Blueprint = self.blueprint_provider(type)
        entity = {"name": self.name, "description": description, "type": self.type}
        if not isinstance(blueprint, Blueprint):
            blueprint = Blueprint(DTO(blueprint))
        self._entity = self._get_entity(blueprint=blueprint, entity=entity)

    @staticmethod
    def parse_value(attr: BlueprintAttribute, blueprint_provider):
        # @todo add exception handling
        default_value = attr.default
        type = attr.attribute_type

        # TODO: Generalize this "setting_defaults" and reuse everywhere (schema)
        if default_value is not None and len(default_value) > 0 and attr.is_array():
            try:
                return json.loads(default_value)
            except JSONDecodeError:
                print(f"invalid default value: {default_value} for attribute: {attr}")
                return []

        if default_value == "":
            if attr.is_array():
                return attr.dimensions.create_default_array(blueprint_provider, attr)
            if type == "boolean":
                return False
            if type == "number":
                return 0.0
            if type == "integer":
                return 0

        if type == "boolean":
            return bool(default_value)
        if type == "number":
            return float(default_value)
        if type == "integer":
            return int(default_value)
        return default_value

    @property
    def entity(self):
        return self._entity

    @staticmethod
    def is_json(attr: BlueprintAttribute):
        try:
            json.loads(attr.default)
            return True
        except JSONDecodeError:
            return False

    @staticmethod
    def parse_json(attr: BlueprintAttribute):
        try:
            return json.loads(attr.default)
        except JSONDecodeError:
            print(f"invalid default value: {attr.default} for attribute: {attr}")
            return ""

    # add all non optional attributes with default value.
    # type is inserted based on the parent attributes type, or the initial type for root entity.
    def _get_entity(self, blueprint: Blueprint, entity):
        for attr in blueprint.attributes:
            if attr.attribute_type in PRIMITIVES:
                if not attr.is_optional() and attr.name not in entity:
                    entity[attr.name] = CreateEntity.parse_value(attr=attr, blueprint_provider=self.blueprint_provider)
            else:
                blueprint = (
                    self.blueprint_provider(SIMOS.ENTITY.value)
                    if attr.attribute_type == BuiltinDataTypes.OBJECT.value
                    else self.blueprint_provider(attr.attribute_type)
                )
                if not isinstance(blueprint, Blueprint):
                    blueprint = Blueprint(DTO(blueprint))
                if attr.is_array():
                    entity[attr.name] = attr.dimensions.create_default_array(self.blueprint_provider, CreateEntity)
        return entity

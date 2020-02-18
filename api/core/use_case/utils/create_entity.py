import json
from json import JSONDecodeError
from typing import List, Union

from classes.blueprint import Blueprint
from classes.blueprint_attribute import BlueprintAttribute
from utils.data_structure.find import get

from utils.form_to_schema import PRIMITIVES
from utils.get_data_type import get_data_type_from_dmt_type as get_data_type


class CreateEntityException(Exception):
    def __init__(self, message: str):
        super()
        self.message = message

    def __str__(self):
        return repr(self.message)


class InvalidDefaultValue(CreateEntityException):
    def __init__(self, attr: BlueprintAttribute, blueprint_name: str):
        super().__init__(message=f"blueprint: {blueprint_name}, attribute: {attr.name} has empty default value.")


def create_default_array(dimensions: List[str], type: Union[type, Blueprint]) -> List:
    if len(dimensions) == 1:
        # Return an empty list if size is "*".
        if dimensions[0] == "*":
            return []
        # Return a list initialized with default values for the size of the array.
        # TODO: Get default values from "system/SIMOS/BlueprintAttribute"
        if isinstance(type, Blueprint):
            return [{} for n in range(int(dimensions[0]))]
        if type is int:
            return [0 for n in range(int(dimensions[0]))]
        if type is float:
            return [0.00 for n in range(int(dimensions[0]))]
        if type is str:
            return ["" for n in range(int(dimensions[0]))]
        if type is bool:
            return [False for n in range(int(dimensions[0]))]

    if dimensions[0] == "*":
        # If the size of the rank is "*" we only create one nested list.
        nested_list = [create_default_array(dimensions[1:], type)]
    else:
        # If the size of the rank in NOT "*", we expect an Integer, and create n number of nested lists.
        nested_list = [create_default_array(dimensions[1:], type) for n in range(int(dimensions[0]))]
    return nested_list


class CreateEntity:
    def __init__(self, blueprint_provider, type: str, description: str, name: str):
        self.name = name
        self.description = description
        self.type = type
        self.blueprint_provider = blueprint_provider
        self.attribute_types = self.blueprint_provider.get_blueprint("system/SIMOS/AttributeTypes").to_dict()
        self.blueprint_attribute: Blueprint = self.blueprint_provider.get_blueprint("system/SIMOS/BlueprintAttribute")
        self.attribute_optional: BlueprintAttribute = next(
            attr for attr in self.blueprint_attribute.attributes if get(attr, "name") == "optional"
        )
        blueprint: Blueprint = self.blueprint_provider.get_blueprint(type)
        entity = {"name": name, "description": description}
        self._entity = self._get_entity(blueprint=blueprint, parent_type=type, entity=entity)

    def is_optional(self, attribute: BlueprintAttribute):
        if attribute.optional is not None:
            return attribute.optional

        if self.attribute_optional is not None:
            return bool(self.attribute_optional.default)

        # todo use default in optional attribute
        return False

    def parse_value(self, attr: BlueprintAttribute):
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
                return create_default_array(
                    attr.dimensions.split(","), get_data_type(attr.attribute_type, self.blueprint_provider)
                )
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

    def default_value(self, attr: BlueprintAttribute, parent_type: str):
        if attr.name == "type":
            return parent_type
        return CreateEntity.parse_value(self, attr)

    @property
    def entity(self):
        return self._entity

    # add all non optional attributes with default value.
    # type is inserted based on the parent attributes type, or the initial type for root entity.
    def _get_entity(self, blueprint: Blueprint, parent_type: str, entity):
        for attr in blueprint.attributes:
            is_optional = self.is_optional(attr)
            if attr.attribute_type in PRIMITIVES:
                if is_optional is not None and not is_optional:
                    default_value = CreateEntity.default_value(self, attr=attr, parent_type=parent_type)

                    if attr.name == "name" and len(default_value) == 0:
                        default_value = parent_type.split("/")[-1].lower()

                    if attr.name not in entity:
                        entity[attr.name] = default_value
            else:
                blueprint = self.blueprint_provider.get_blueprint(attr.attribute_type)
                if attr.is_array():
                    entity[attr.name] = []
                elif attr.is_optional():
                    entity[attr.name] = {}
                else:
                    entity[attr.name] = self._get_entity(
                        blueprint=blueprint, parent_type=attr.attribute_type, entity={}
                    )
        return entity

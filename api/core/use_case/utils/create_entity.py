from core.domain.dynamic_models import BlueprintAttribute, AttributeTypes, Blueprint
from utils.data_structure.find import get


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
    def __init__(self, blueprint_provider, type: str, description: str, name: str):
        self.name = name
        self.description = description
        self.type = type
        self.blueprint_provider = blueprint_provider
        self.attribute_types: AttributeTypes = self.blueprint_provider.get_blueprint("system/SIMOS/AttributeTypes")
        self.blueprint_attribute: Blueprint = self.blueprint_provider.get_blueprint("system/SIMOS/BlueprintAttribute")
        self.attribute_optional: BlueprintAttribute = [
            attr for attr in self.blueprint_attribute.attributes if get(attr, "name") == "optional"
        ][0]
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

    @property
    def primitives(self):
        return [type for type in get(self.attribute_types, "values") if type != "blueprint"]

    @staticmethod
    def parse_value(attr: BlueprintAttribute):
        # @todo add exception handling
        default_value = attr.default
        type = attr.type
        if type == "boolean":
            return bool(default_value)
        if type == "number":
            return float(default_value)
        if type == "integer":
            return int(default_value)
        return default_value

    @staticmethod
    def default_value(attr: BlueprintAttribute, parent_type: str):
        if attr.name == "type":
            return parent_type
        return CreateEntity.parse_value(attr)

    @property
    def entity(self):
        return self._entity

    # add all non optional attributes with default value.
    # type is inserted based on the parent attributes type, or the initial type for root entity.
    def _get_entity(self, blueprint: Blueprint, parent_type: str, entity):
        for attr in blueprint.attributes:
            is_optional = self.is_optional(attr)
            if attr.type in self.primitives:
                if is_optional is not None and not is_optional:
                    default_value = CreateEntity.default_value(attr=attr, parent_type=parent_type)
                    if attr.name not in entity:
                        entity[attr.name] = default_value
            else:
                blueprint = self.blueprint_provider.get_blueprint(attr.type)
                if attr.dimensions == "*":
                    entity[attr.name] = []
                else:
                    entity[attr.name] = self._get_entity(blueprint=blueprint, parent_type=attr.type, entity={})
        return entity

from core.domain.dynamic_models import BlueprintAttribute, AttributeTypes

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

    def __init__(self, blueprint_provider):
        self.blueprint_provider = blueprint_provider
        self.attribute_types: AttributeTypes = self.blueprint_provider.get_blueprint('system/SIMOS/AttributeTypes')
        self.blueprint_attribute: BlueprintAttribute = self.blueprint_provider.get_blueprint('system/SIMOS/BlueprintAttribute')
        self.attribute_optional = [attr for attr in self.blueprint_attribute.attributes if attr["name"] == 'optional']

    def is_optional(self, attribute: BlueprintAttribute):
        if attribute.optional is not None:
            return attribute.optional

        if self.attribute_optional is not None:
            return bool(self.attribute_optional.default)

        # todo use default in optional attribute
        return False


    @property
    def primitives(self):
        return [type for type in self.attribute_types.values if type != 'blueprint']

    @staticmethod
    def parse_value(attr: BlueprintAttribute):
        # @todo add exception handling
        default_value = attr.default
        type = attr.type
        if type == 'boolean':
            return bool(default_value)
        if type == 'number':
            return float(default_value)
        if type == 'integer':
            return int(default_value)
        return default_value


    @staticmethod
    def default_value(attr: BlueprintAttribute, blueprint_name: str):
        if attr.type == 'string' and len(attr.default) == 0:
            if attr.name == 'type':
                raise InvalidDefaultValue(attr=attr, blueprint_name=blueprint_name)
            return ""
        if len(attr.default) == 0:
            raise InvalidDefaultValue(attr=attr, blueprint_name=blueprint_name)
        return CreateEntity.parse_value(attr)

    def get_entity(self, blueprint):
        entity = {}

        for attr in blueprint.attributes:
            is_optional = self.is_optional(attr)
            if attr.type in self.primitives:
                if is_optional is not None and not is_optional:
                    entity[attr.name] = CreateEntity.default_value(attr=attr, blueprint_name=blueprint.name)
            else:
                blueprint = self.blueprint_provider.get_blueprint(attr.type)
                if attr.dimensions == '*':
                    entity[attr.name] = []
                else:
                    entity[attr.name] = self.get_entity(blueprint=blueprint)
        return entity
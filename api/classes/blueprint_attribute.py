from typing import Optional

from core.enums import SIMOS
from core.enums import PRIMITIVES


class BlueprintAttribute:
    def __init__(
        self,
        name: str,
        attribute_type: str,
        description: Optional[str] = None,
        label: Optional[str] = None,
        default: Optional[str] = None,
        dimensions: Optional[str] = None,
        optional: Optional[bool] = None,
        contained: Optional[bool] = None,
        enum_type: Optional[str] = None,
    ):
        self.name = name
        self.attribute_type = attribute_type
        self.type = SIMOS.BLUEPRINT_ATTRIBUTE.value
        self.description = description if description else ""
        self.label = label if label else ""
        self.default = default if default else ""
        self.dimensions = dimensions if dimensions else ""
        self.optional = optional if optional else False
        self.contained = contained if contained else True
        self.enum_type = enum_type if enum_type else ""

    def is_array(self):
        return self.dimensions == "*"

    def is_primitive(self):
        return self.attribute_type in PRIMITIVES

    def is_optional(self):
        # todo get default from blueprint attribute optional's default value.
        default_optional = False
        return self.optional if self.optional is not None else default_optional

    def to_dict(self):
        return {
            "name": self.name,
            "attributeType": self.attribute_type,
            "type": self.type,
            "description": self.description,
            "label": self.label,
            "default": self.default,
            "dimensions": self.dimensions,
            "optional": self.optional,
            "contained": self.contained,
            "enumType": self.enum_type,
        }

    def to_json_schema(self):
        return {
            "name": self.name,
            "type": self.attribute_type,
            "description": self.description,
            "label": self.label,
            "default": self.default if not self.attribute_type == "boolean" else True,
            "optional": self.optional,
        }

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            name=adict["name"],
            attribute_type=adict["attributeType"],
            description=adict.get("description", ""),
            label=adict.get("label", ""),
            default=adict.get("default", ""),
            dimensions=adict.get("dimensions", ""),
            optional=adict.get("optional", False),
            contained=adict.get("contained", True),
            enum_type=adict.get("enumType", ""),
        )
        return instance

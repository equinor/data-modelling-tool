from typing import Optional, Union

from domain_classes.dimension import Dimension
from enums import PRIMITIVES, SIMOS


class BlueprintAttribute:
    def __init__(
        self,
        name: str,
        attribute_type: str,
        description: Optional[str] = None,
        label: Optional[str] = None,
        default: Optional[Union[str, list]] = None,
        dimensions: Optional[str] = "",
        optional: Optional[bool] = None,
        contained: Optional[bool] = None,
        enum_type: Optional[str] = None,
    ):
        self.name = name
        self.attribute_type = attribute_type
        self.type = SIMOS.BLUEPRINT_ATTRIBUTE.value
        self.description = description if description else None
        self.label = label if label else None
        self.default = default if default else None
        self.optional = optional if optional is not None else False
        self.contained = contained if contained is not None else True
        self.enum_type = enum_type if enum_type else ""
        self.dimensions: Dimension = Dimension(dimensions, self.attribute_type, self)

    def __repr__(self):
        return f"Name: {self.name}, attributeType: {self.attribute_type}"

    @property
    def is_array(self):
        return self.dimensions.is_array

    @property
    def is_primitive(self):
        return self.attribute_type in PRIMITIVES

    @property
    def is_optional(self):
        return self.optional

    def to_dict(self):
        return {
            "name": self.name,
            "attributeType": self.attribute_type,
            "type": self.type,
            "description": self.description,
            "label": self.label,
            "default": self.default,
            "dimensions": self.dimensions.to_dict(),
            "optional": self.optional,
            "contained": self.contained,
            "enumType": self.enum_type,
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

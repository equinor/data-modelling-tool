from typing import Optional


class BlueprintAttribute:
    def __init__(
        self,
        name: str,
        type: str,
        description: Optional[str] = None,
        label: Optional[str] = None,
        default: Optional[str] = None,
        attribute_type: Optional[str] = None,
        dimensions: Optional[str] = None,
        optional: Optional[bool] = None,
        contained: Optional[bool] = None,
        enum_type: Optional[str] = None,
    ):
        self.name = name
        self.type = type
        self.description = description if description else ""
        self.label = label if label else ""
        self.default = default if default else ""
        self.attribute_type = attribute_type if attribute_type else "system/SIMOS/BlueprintAttribute"
        self.dimensions = dimensions if dimensions else ""
        self.optional = optional if optional else False
        self.contained = contained if contained else True
        self.enum_type = enum_type if enum_type else ""

    def to_dict(self):
        return {
            "name": self.name,
            "type": self.type,
            "description": self.description,
            "label": self.label,
            "default": self.default if not self.type == "boolean" else True,
            "attributeType": self.attribute_type,
            "dimensions": self.dimensions,
            "optional": self.optional,
            "contained": self.contained,
            "enumType": self.enum_type,
        }

    @classmethod
    def from_dict(cls, adict):
        instance = cls(
            adict.get("name"),
            adict.get("type"),
            adict.get("description", ""),
            adict.get("label", ""),
            adict.get("default", ""),
            adict.get("attributeType", "system/SIMOS/BlueprintAttribute"),
            adict.get("dimensions", ""),
            adict.get("optional", False),
            adict.get("contained", True),
            adict.get("enumType", ""),
        )
        return instance

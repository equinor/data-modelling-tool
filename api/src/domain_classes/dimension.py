from typing import Callable, List

from enums import PRIMITIVES


class Dimension:
    def __init__(self, dimensions: str, attribute_type: str, attribute=None):
        self.dimensions: List[str] = dimensions.split(",")
        self.type: attribute_type = attribute_type
        self.value = None
        self.attribute = attribute

    @property
    def is_array(self):
        return self.dimensions != [""]

    @property
    def is_matrix(self):
        return len(self.dimensions) > 1

    # If the inner most dimension is "*", the Dimension is unfixed
    def is_unfixed(self):
        return self.dimensions[-1] == "*"

    def create_default_array(self, blueprint_provider, create_entity: Callable):
        def create_default_array_recursive(dimensions: List[str]) -> List:
            if len(dimensions) == 1:
                # Return an empty list if size is "*".
                if dimensions[0] == "*":
                    return []
                # Return a list initialized with default values for the size of the array.
                if self.type not in PRIMITIVES:
                    # For fixed complex types, create the entity with default values. Set name from list index.
                    return [
                        create_entity(blueprint_provider, {"type": self.type, "name": str(n)})
                        for n in range(int(dimensions[0]))
                    ]
                if self.type == "number":
                    return [0 for n in range(int(dimensions[0]))]
                if self.type == "string":
                    return ["" for n in range(int(dimensions[0]))]
                if self.type == "boolean":
                    return [False for n in range(int(dimensions[0]))]

            if dimensions[0] == "*":
                # If the size of the rank is "*" we only create one nested list.
                nested_list = [create_default_array_recursive(dimensions[1:])]
            else:
                # If the size of the rank in NOT "*", we expect an Integer, and create n number of nested lists.
                nested_list = [create_default_array_recursive(dimensions[1:]) for n in range(int(dimensions[0]))]
            return nested_list

        if not self.is_array:
            raise Exception("This attribute is not an array!")

        if self.attribute and self.attribute.default:
            self.value = self.attribute.default
        else:
            self.value = create_default_array_recursive(self.dimensions)
        return self.value

    def to_dict(self):
        return ",".join(self.dimensions)

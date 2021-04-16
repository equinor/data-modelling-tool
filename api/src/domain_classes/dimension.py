from typing import List

from utils.get_python_type import get_python_type_from_dmt_type


class Dimension:
    def __init__(self, dimensions: str, attribute_type: str):
        self.dimensions: List[str] = dimensions.split(",")
        self.type: attribute_type = get_python_type_from_dmt_type(attribute_type)
        self.value = None

    def is_array(self):
        return self.dimensions != [""]

    def is_matrix(self):
        return len(self.dimensions) > 1

    # If the inner most dimension is "*", the Dimension is unfixed
    def is_unfixed(self):
        return self.dimensions[-1] == "*"

    def create_default_array(self, blueprint_provider, create_entity_class):
        def create_default_array_recursive(dimensions: List[str]) -> List:
            if len(dimensions) == 1:
                # Return an empty list if size is "*".
                if dimensions[0] == "*":
                    return []
                # Return a list initialized with default values for the size of the array.
                if not type(self.type) is type:
                    # For fixed complex types, create the entity with default values. Set name from list index.
                    return [
                        create_entity_class(blueprint_provider, self.type, "", str(n)).entity
                        for n in range(int(dimensions[0]))
                    ]
                if self.type is int:
                    return [0 for n in range(int(dimensions[0]))]
                if self.type is float:
                    return [0.00 for n in range(int(dimensions[0]))]
                if self.type is str:
                    return ["" for n in range(int(dimensions[0]))]
                if self.type is bool:
                    return [False for n in range(int(dimensions[0]))]

            if dimensions[0] == "*":
                # If the size of the rank is "*" we only create one nested list.
                nested_list = [create_default_array_recursive(dimensions[1:])]
            else:
                # If the size of the rank in NOT "*", we expect an Integer, and create n number of nested lists.
                nested_list = [create_default_array_recursive(dimensions[1:]) for n in range(int(dimensions[0]))]
            return nested_list

        if self.dimensions == [""]:
            raise Exception("This attribute is not an array!")
        self.value = create_default_array_recursive(self.dimensions)
        return self.value

    def to_dict(self):
        return ",".join(self.dimensions)

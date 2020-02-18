from typing import List

from utils.get_data_type import get_data_type_from_dmt_type


class Dimension:
    def __init__(self, dimensions: str, attribute_type: str):
        self.dimensions: List[str] = dimensions.split(",")
        self.type: attribute_type = get_data_type_from_dmt_type(attribute_type)
        self.value = None

    def is_array(self):
        return self.dimensions != [""]

    def is_matrix(self):
        return len(self.dimensions) > 1

    def create_default_array(self):
        def create_default_array_recursive(dimensions: List[str], type) -> List:
            if len(dimensions) == 1:
                # Return an empty list if size is "*".
                if dimensions[0] == "*":
                    return []
                # Return a list initialized with default values for the size of the array.
                # TODO: Get default values from "system/SIMOS/BlueprintAttribute"
                # if isinstance(type, Blueprint):
                if type is dict:
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
                nested_list = [create_default_array_recursive(dimensions[1:], type)]
            else:
                # If the size of the rank in NOT "*", we expect an Integer, and create n number of nested lists.
                nested_list = [create_default_array_recursive(dimensions[1:], type) for n in range(int(dimensions[0]))]
            return nested_list

        if self.dimensions == [""]:
            raise Exception(f"This attribute is not an array!")
        self.value = create_default_array_recursive(self.dimensions, self.type)
        return self.value

    def to_dict(self):
        return ",".join(self.dimensions)

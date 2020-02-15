from typing import Union

from classes.blueprint import Blueprint
from core.enums import PrimitiveDataTypes


def get_data_type_from_dmt_type(attribute_type: str, blueprint_provider) -> Union[type, Blueprint]:
    try:
        type_enum = PrimitiveDataTypes(attribute_type)
        return type_enum.to_py_type()
    except ValueError:
        return blueprint_provider.get(attribute_type)
    except Exception as error:
        raise Exception(f"Something went wront trying to fetch data type: {error}")

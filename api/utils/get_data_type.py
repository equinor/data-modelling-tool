from core.enums import PrimitiveDataTypes


# Convert dmt attribute_types to python types. If complex, return type as string.
def get_data_type_from_dmt_type(attribute_type: str):
    try:
        type_enum = PrimitiveDataTypes(attribute_type)
        return type_enum.to_py_type()
    except ValueError:
        return attribute_type
    except Exception as error:
        raise Exception(f"Something went wrong trying to fetch data type: {error}")

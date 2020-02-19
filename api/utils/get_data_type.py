from core.enums import PrimitiveDataTypes


def get_data_type_from_dmt_type(attribute_type: str, blueprint_provider=None):
    try:
        type_enum = PrimitiveDataTypes(attribute_type)
        return type_enum.to_py_type()
    except ValueError:
        # TODO: Return a proper Blueprint
        # return blueprint_provider.get_blueprint(attribute_type)
        return dict
    except Exception as error:
        raise Exception(f"Something went wront trying to fetch data type: {error}")

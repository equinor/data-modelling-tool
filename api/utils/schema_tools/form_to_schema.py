from flask_restful import abort


def get_common_keys(attribute):
    return {
        "type": attribute.get("type", "string"),
        "unit": attribute.get("unit", "nil"),
        "value": attribute.get("value", "nil"),
        "dimensions": attribute.get("dimensions", ""),
    }


def dimensions_to_int(dimensions: list):
    # TODO: Add support for matrices
    if len(dimensions) > 1:
        abort(401, "Sorry, we dont support matrices")
    if not dimensions:
        return 0
    if dimensions[0] == "*":
        return -1
    try:
        return int(dimensions[0])
    except ValueError:
        return 0


def form_to_schema(form: dict):
    properties = {
        "title": {"title": "Title", "type": "string", "default": ""},
        "description": {"title": "Description", "type": "string", "default": ""},
    }

    # TODO: Only handles arrays, not matrices
    for attribute in form["attributes"]:
        array_size = dimensions_to_int(attribute.get("dimensions", []))

        # Custom length
        if array_size == -1:
            properties[attribute["name"]] = {"type": "array", "items": {**get_common_keys(attribute)}}
        # Fixed length
        elif array_size > 0:
            array = []
            for i in range(array_size):
                array.append({**get_common_keys(attribute)})
            properties[attribute["name"]] = {"type": "array", "items": array}
        # No dimension
        else:
            properties[attribute["name"]] = {**get_common_keys(attribute)}

    form.pop("attributes")
    form["properties"] = properties

    return form

from flask import request
from flask_restful import Resource

from utils.numbers import dimensions_to_int


def get_common_properties(attribute):
    return {
        "type": attribute.get('type', 'string'),
        'unit': attribute.get('unit', 'nil'),
        'value': attribute.get('value', 'nil'),
        'dimensions': attribute.get('dimensions', ''),
    }


class FormToSchema(Resource):
    @staticmethod
    def post():
        form = request.get_json()
        properties = {}

        # TODO: Only handles arrays, not matrices
        for attribute in form['attributes']:
            array_size = dimensions_to_int(attribute.get('dimensions', ""))

            # Custom length
            if array_size == -1:
                properties[attribute['name']] = {
                    "type": "array",
                    "items": {
                        **get_common_properties(attribute)
                    }
                }
            # Fixed length
            elif array_size > 0:
                array = []
                for i in range(array_size):
                    array.append({**get_common_properties(attribute)})
                properties[attribute['name']] = {
                    "type": "array",
                    "items": array
                }
            # No dimension
            else:
                properties[attribute['name']] = {
                    **get_common_properties(attribute)
                }

        form.pop('attributes')
        form['properties'] = properties
        return form

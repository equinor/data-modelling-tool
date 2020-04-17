import json

from dmss_api import ApiException, InlineResponse2001

from flask import Response
from urllib3 import HTTPResponse

from core.serializers.dto_json_serializer import DTOSerializer


def dmss_api_wrapper(func):
    def decorator(*args, **kwargs):
        try:
            response = func(*args, **kwargs)
            # TODO: Dont know why it returns different types...
            if isinstance(response, (InlineResponse2001, HTTPResponse)):
                return Response(
                    json.dumps(json.loads(response.data.decode()), cls=DTOSerializer),
                    mimetype="application/json",
                    status=response.status,
                )
            else:
                return Response(json.dumps(response, cls=DTOSerializer), mimetype="application/json", status=200)
        except ApiException as error:
            response = Response(error.body, mimetype="application/json", status=error.status)
            return response

    return decorator

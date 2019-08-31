import collections
from pprint import pprint

from behave import *
import json
from deepdiff import DeepDiff

STATUS_CODES = {
    u'OK': 200,
    u'Created': 201,
    u'No Content': 204,
    u'Bad Request': 400,
    u'Unauthorized': 401,
    u'Not Found': 404,
    u'Conflict': 409
}


@then(u'the response status should be "{status}"')
def step_impl(context, status):
    return context.response_status == STATUS_CODES[status]


@then('the response should contain')
def json_at_path(context):
    actual = context.response_json
    data = context.text or context.data
    expected = json.loads(data)
    result = DeepDiff(actual, expected, ignore_order=True)
    if result != {}:
        print(result)
    assert result == {}

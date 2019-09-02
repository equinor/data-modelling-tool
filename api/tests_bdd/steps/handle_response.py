from behave import then
import json
from deepdiff import DeepDiff

STATUS_CODES = {
    "OK": 200,
    "Created": 201,
    "No Content": 204,
    "Bad Request": 400,
    "Unauthorized": 401,
    "Not Found": 404,
    "Conflict": 409,
}


@then('the response status should be "{status}"')
def step_response_status(context, status):
    return context.response_status == STATUS_CODES[status]


@then("the response should contain")
def json_at_path(context):
    actual = context.response_json
    data = context.text or context.data
    expected = json.loads(data)
    result = DeepDiff(actual, expected, ignore_order=True)
    if result != {}:
        print(result)
    assert result == {}

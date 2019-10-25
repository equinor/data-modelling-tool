from behave import then
import json
from deepdiff import DeepDiff
from utils.data_structure.traverse import traverse_compare
import pprint

STATUS_CODES = {
    "OK": 200,
    "Created": 201,
    "No Content": 204,
    "Bad Request": 400,
    "Unauthorized": 401,
    "Not Found": 404,
    "Conflict": 409,
    "System Error": 500,
}


@then('the response status should be "{status}"')
def step_response_status(context, status):
    if context.response_status != STATUS_CODES[status]:
        pp = pprint.PrettyPrinter(indent=2)
        pretty_print = "\n Actual: \n {} \n Expected: \n {}".format(
            pp.pformat(context.response_status), pp.pformat(STATUS_CODES[status])
        )
        print(pretty_print)
        if "response_json" in context:
            print(context.response_json)
        else:
            print(context.response.data)
    assert context.response_status == STATUS_CODES[status]


@then("the response should equal")
def step_impl_equal(context):
    actual = context.response_json
    data = context.text or context.data
    expected = json.loads(data)
    result = DeepDiff(expected, actual, ignore_order=True)
    if result != {}:
        print(result)
        print(actual)
    assert result == {}


def pretty_eq(expected, actual):
    pp = pprint.PrettyPrinter(indent=2)
    a = traverse_compare(expected, actual)
    b = []
    default_print = "\n {} != {}".format(pp.pformat(a), pp.pformat(b))
    pretty_print = "\n Actual: \n {} \n Expected: \n {}".format(pp.pformat(actual), pp.pformat(expected))
    msg = "{} \n {}".format(default_print, pretty_print)
    if a != b:
        print(msg)
    assert a == b


@then("the response should contain")
def step_impl_contain(context):
    actual = context.response_json
    print(actual)
    data = context.text or context.data
    expected = json.loads(data)
    try:
        pretty_eq(expected, actual)
    except Exception:
        assert actual == expected


@then("the response should be")
def step_impl_should_be(context):
    actual = context.response_json
    data = context.text or context.data
    pretty_eq(data, actual)

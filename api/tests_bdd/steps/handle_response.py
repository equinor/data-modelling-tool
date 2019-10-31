from behave import then
import json
from deepdiff import DeepDiff
from utils.data_structure.traverse import traverse_compare
import pprint
from pygments import highlight
from pygments.lexers import JsonLexer
from pygments.formatters import TerminalFormatter

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


def print_pygments(json_object):
    json_str = json.dumps(json_object, indent=2, sort_keys=True)
    print(highlight(json_str, JsonLexer(), TerminalFormatter()))


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
    try:
        a = traverse_compare(expected, actual)
        b = []
        if a != b:
            print("Actual:")
            print_pygments(actual)
            print("Expected:")
            print_pygments(expected)
            print("Differences:")
            print_pygments(a)
        assert a == b
    except KeyError:
        print_pygments(actual)
        raise Exception
    except IndexError:
        print_pygments(actual)
        raise Exception
    except Exception:
        raise Exception


@then("the response should contain")
def step_impl_contain(context):
    actual = context.response_json
    data = context.text or context.data
    expected = json.loads(data)
    pretty_eq(expected, actual)

@then("the response should be")
def step_impl_should_be(context):
    actual = context.response_json
    data = context.text or context.data
    pretty_eq(data, actual)

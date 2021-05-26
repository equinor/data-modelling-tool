from behave import then
import json
from deepdiff import DeepDiff
from pprint import pprint
import pprint
from utils.data_structure.compare import pretty_eq, print_pygments
from utils.data_structure.find import find

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


@then("the response at {dot_path} should equal")
def step_impl_equal_dot_path(context, dot_path):
    actual = context.response_json
    target = find(actual, dot_path.split("."))
    data = context.text or context.data
    expected = json.loads(data)
    result = DeepDiff(target, expected, ignore_order=True)
    if result != {}:
        print("Actual:", target)
        print("Expected:", expected)
    assert result == {}


@then("the response should contain")
def step_impl_contain(context):
    from dictdiffer import diff

    actual = context.response_json
    data = context.text or context.data
    expected = json.loads(data)
    result = diff(actual, expected)
    changes = [diff for diff in result if diff[0] == "change"]
    if changes:
        for c in changes:
            location = c[1] if isinstance(c[1], str) else ".".join([str(v) for v in c[1]])
            print_pygments({"location": location, "difference": {"actual": c[2][0], "expected": c[2][1]}})
        raise ValueError("The response does not match the expected result")


@then("the array at {dot_path} should be of length {length}")
def step_impl_contain(context, dot_path, length):
    actual = context.response_json
    target = find(actual, dot_path.split("."))
    result = len(target) == int(length)
    if not result:
        print(f"array is of length {len(target)}")
        print("array:", target)
    assert result


@then("the response should be")
def step_impl_should_be(context):
    actual = context.response_json
    data = context.text or context.data
    pretty_eq(data, actual)

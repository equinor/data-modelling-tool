import json

from behave import when, given


def context_response_json(context):
    response = context.response
    context.response_json = response.json()


@given('i access the resource url "{url}"')
def step_access_url(context, url):
    context.url = str(url)


@when('i make a "{method}" request')
def step_make_request(context, method):
    data = {}
    if "text" in context and context.text:
        context.request_json = json.loads(context.text)
        data = json.dumps(context.request_json)

    headers = {}

    if method == "PUT":
        context.response = context.client.put(url=context.url, data=data, headers=headers)
    elif method == "POST":
        context.response = context.client.post(url=context.url, data=data, headers=headers)
    elif method == "GET":
        context.response = context.client.get(url=context.url, headers=headers)
    elif method == "DELETE":
        context.response = context.client.delete(url=context.url, headers=headers)

    context.response_status = context.response.status_code

    context_response_json(context)

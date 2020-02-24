import requests
import json

URL = 'http://localhost/api'


def request(endpoint, data=None, files=None,
            raise_for_status=True, req_type='post'):
    """Wrapper method for calling DMT API which adds the required auth
    token before sending the request.
    :param endpoint: URL for API endpoint
    :param data: Dictionary containing form data
    :param raise_for_status: Raise exception for 4xx and 5xx status codes
    :param req_type: The request type (GET, POST). Defaults to POST
    """
    if data is None:
        data = {}

    headers = {
        "Content-Type": "application/json"
    }

    if req_type == 'post':
        r = requests.post(URL + endpoint, data=json.dumps(data), files=files,
                          headers=headers)
    elif req_type == 'put':
        r = requests.put(URL + endpoint, data=json.dumps(data),
                         headers=headers)
    else:
        r = requests.get(URL + endpoint, params=data, headers=headers)
    if raise_for_status:
        r.raise_for_status()
    return r

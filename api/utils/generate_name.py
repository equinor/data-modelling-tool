import base64
from os import urandom


def generate_name(type: str):
    name_of_type = type.split("/")[-1]
    lower_case_type_name = name_of_type.lower()
    random_suffix = base64.urlsafe_b64encode(urandom(6)).decode()
    return f"{lower_case_type_name}-{random_suffix}"

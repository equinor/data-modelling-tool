from unittest import skip

# TODO: Use the dynamic classes (remember that they must (possibly) be generated before this test runs)
from core.domain.models import Blueprint


@skip("not working")
def test_package_model_init():
    data = {"uid": 1, "name": "Name", "description": "", "template_ref": ""}

    package = Blueprint(**data)
    assert isinstance(package, Blueprint)
    assert package.form_data.title == data["uid"]


@skip("not working")
def test_package_model_from_dict():
    form_data = {"uid": 1, "name": "Name", "description": "", "template_ref": ""}
    package = Blueprint.from_dict(form_data)
    assert package.form_data.title == form_data["uid"]


@skip("not working")
def test_package_model_to_dict():
    form_data = {"uid": 1, "name": "Name", "description": "", "template_ref": ""}
    package = Blueprint.from_dict(form_data)
    assert package.to_dict() == form_data


@skip("not working")
def test_package_model_comparison():
    data = {"uid": 1, "name": "Name", "description": "", "template_ref": ""}
    b2 = Blueprint.from_dict(data)
    b1 = Blueprint.from_dict(data)
    assert b2 == b1

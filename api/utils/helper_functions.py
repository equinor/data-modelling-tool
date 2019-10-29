from pathlib import Path
from typing import Tuple, Union


def get_absolute_path(files: [], data_source_id):
    absolute_paths = []
    for file in files:
        absolute_paths.append(f"{data_source_id}/{file}")
    return absolute_paths


def get_parent_id_strip_data_source(absolute_parent_id: str):
    if "/" in absolute_parent_id:
        return absolute_parent_id.split("/", 1)[1]
    else:
        return ""


def get_data_source_and_path(reference: str) -> Tuple[str, str]:
    ref_elements = reference.split("/", 1)
    if len(ref_elements) <= 1:
        raise Exception(f"Invalid reference: {reference}")
    return ref_elements[0], ref_elements[1]


def get_package_and_path(reference: str) -> Tuple[str, Union[list, None]]:
    elements = reference.split("/")
    package = elements.pop(0)
    if len(elements) == 0:
        return package, None
    return package, elements


def schemas_location() -> Path:
    return Path(__file__).parent.parent.parent / "home" / "core"

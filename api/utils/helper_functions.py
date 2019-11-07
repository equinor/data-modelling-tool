from pathlib import Path
from typing import Tuple, Union


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
    return Path(__file__).parent.parent / "home" / "core"

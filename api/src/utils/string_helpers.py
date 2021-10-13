from typing import Tuple


def split_absolute_ref(reference: str) -> Tuple[str, str, str]:
    data_source, dotted_path = reference.split("/", 1)
    attribute = ""
    path = dotted_path
    if "." in dotted_path:  # Dotted path has a attribute reference.
        path, attribute = dotted_path.split(".", 1)
    return data_source, path, attribute

from typing import Any, Dict, Union
from core.domain.dto import DTO


def get_ref_id(ref: Union[DTO, Dict[str, Any]]) -> str:
    # FIXME: This should be removed once the reference has a proper class
    # FIXME: The need for this method is caused by `Entity` being ignored / not cast as a class in the code generation
    if isinstance(ref, DTO):
        return ref.uid
    for key in ["uid", "_id", "id"]:
        try:
            return ref[key]
        except KeyError:
            continue

import json
from pathlib import Path
from typing import Optional, Union


class LocalFileRepository:
    def __init__(self, location: Optional[Union[str, Path]] = None):
        if location is None:
            location = f"{str(Path(__file__).parent.parent.parent.parent.parent.parent)}/data-modelling-storage-service/api/home/"
        self.path = Path(location)

    def get(self, doc_ref: str) -> dict:
        try:
            with open(str(self.path / f"{doc_ref}.json")) as f:
                return json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"'{doc_ref}' not found. Are DMSS core blueprints available at {self.path}?")

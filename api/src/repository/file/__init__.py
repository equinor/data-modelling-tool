import json
from pathlib import Path
from typing import Optional, Union


class LocalFileRepository:
    def __init__(self, location: Optional[Union[str, Path]] = None):
        if location is None:
            # If running locally, in a development environment, the SIMOS blueprints are expected to be found
            # in the dmss repo next to this repo.
            # If SIMOS blueprints are not found, expect them to be in this repo at "./src/dmss" (cloned during CI)
            dev_path = (
                f"{str(Path(__file__).parent.parent.parent.parent.parent.parent)}"
                "/data-modelling-storage-service/src/home/"
            )
            print(dev_path)
            print(Path(dev_path).is_dir())
            location = dev_path if Path(dev_path).is_dir() else "/code/src/dmss/src/home"
        self.path = Path(location)

    def get(self, doc_ref: str) -> dict:
        try:
            with open(str(self.path / f"{doc_ref}.json")) as f:
                return json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"'{doc_ref}' not found. Are DMSS core blueprints available at {self.path}?")

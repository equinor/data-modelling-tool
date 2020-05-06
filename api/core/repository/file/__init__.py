import json
from pathlib import Path
from typing import Optional, Union

from core.repository.repository_exceptions import TemplateNotFound
from utils.helper_functions import schemas_location


class TemplateRepositoryFromFile:
    def __init__(self, location: Optional[Union[str, Path]] = None):
        if location is None:
            location = schemas_location()
        self.path = Path(location)

    def get(self, template_type: str):
        return self[template_type]

    def __getitem__(self, template_type: str) -> dict:
        data_source, *rest = template_type.split("/")
        template_type = "/".join(rest)
        path = self.path
        if data_source == "system":
            path = path / "core"
        elif data_source == "SSR-DataSource":
            path = path / "blueprints"
        try:
            with open(str(path / f"{template_type}.json")) as f:
                schema = json.load(f)
        except FileNotFoundError:
            raise TemplateNotFound(template_type)
        return schema

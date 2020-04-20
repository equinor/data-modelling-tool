import json
from pathlib import Path
from typing import Dict, Union

from classes.dto import DTO
from core.repository.repository_exceptions import TemplateNotFound
from core.repository.repository_interface import RepositoryInterface


class TemplateRepositoryFromFile(RepositoryInterface):
    def __init__(self, location: Union[str, Path]):
        self.path = Path(location)

    def get(self, template_type: str):
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

    def find(self, filter: dict, single=None, raw=None) -> DTO:
        template_type = filter["type"]
        return self.get(template_type)

    def find_one(self, filters: Dict) -> Dict:
        raise NotImplementedError

    def add(self, document: DTO) -> None:
        raise NotImplementedError

    def delete(self, document: DTO) -> None:
        raise NotImplementedError

    def update(self, document: DTO) -> None:
        raise NotImplementedError

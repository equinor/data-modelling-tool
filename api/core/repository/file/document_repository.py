import json
from pathlib import Path
from typing import Union

from core.domain.dto import DTO
from core.repository.interface.document_repository import DocumentRepository
from core.repository.repository_exceptions import TemplateNotFound


class TemplateRepositoryFromFile(DocumentRepository):
    def __init__(self, location: Union[str, Path]):
        self.path = Path(location)

    def get(self, template_type: str):
        data_source, *rest = template_type.split("/")
        template_type = "/".join(rest)
        try:
            with open(str(self.path / f"{template_type}.json")) as f:
                schema = json.load(f)
        except FileNotFoundError:
            raise TemplateNotFound(template_type)
        return schema

    def find(self, filter: dict, single=None, raw=None) -> DTO:
        template_type = filter["type"]
        return self.get(template_type)

    def add(self, document: DTO) -> None:
        raise NotImplementedError

    def delete(self, document: DTO) -> None:
        raise NotImplementedError

    def update(self, document: DTO) -> None:
        raise NotImplementedError

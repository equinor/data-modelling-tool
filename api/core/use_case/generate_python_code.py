from __future__ import annotations

from collections import defaultdict
from typing import Callable, Union, Dict, Optional, List

from classes.schema import Factory, get_dto
from classes.dto import DTO
from core.repository import Repository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared import request_object as req
from core.shared import response_object as res
from core.shared import use_case as uc
import zipfile
import io

from core.enums import DMT


class GeneratePythonCodeRequestObject(req.ValidRequestObject):
    def __init__(self, document_id: str = None, data_source_id: str = None):
        self.document_id = document_id
        self.data_source_id = data_source_id

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "documentId" not in adict:
            invalid_req.add_error("documentId", "is missing")

        if "dataSourceId" not in adict:
            invalid_req.add_error("dataSourceId", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(document_id=adict.get("documentId"), data_source_id=adict.get("dataSourceId"),)


def is_package(blueprint: DTO):
    return blueprint.type == DMT.PACKAGE.value


def is_simple(attribute) -> bool:
    if isinstance(attribute, dict):
        attribute_type = attribute["attribute_type"]
    else:
        attribute_type = attribute.attribute_type
    return attribute_type in ["string", "number", "integer", "boolean"]


def get_stringcase() -> str:
    import stringcase

    with open(stringcase.__file__) as f:
        content = "\n".join(f.readlines())
    return content


class GeneratePythonCodeUseCase(uc.UseCase):
    def __init__(self, document_repository: Repository, repository_getter: Callable[[str], Repository]):
        self.document_repository = document_repository
        self.repository_getter = repository_getter
        self._factory = Factory(self.document_repository, template_repository_getter=self.repository_getter)

    def get_blueprints(self, blueprint: DTO, files: dict = None, prefix: str = "") -> Dict[str, type]:
        if files is None:
            files = {}
        if "_id" in blueprint.data:
            del blueprint.data["_id"]
        name = blueprint.name
        if prefix:
            name = f"{prefix}/{name}"
        if is_package(blueprint):
            for reference in blueprint["content"]:
                dto = self.document_repository.get(reference["_id"])
                self.get_blueprints(dto, files, name)
        else:
            try:
                blueprint = self.get(name)
            except Exception:
                blueprint = self.from_schema(blueprint.data, name)
            files[name] = blueprint
        return files

    def get_dependency_graph(self, blueprint, data_source_id: str) -> Dict[str, set]:
        blueprints = self.get_blueprints(blueprint, prefix=data_source_id)
        paths = {}
        dependencies = defaultdict(set)
        for path, blueprint in blueprints.items():
            paths[blueprint] = path
        blueprints = list(blueprints.keys())
        while len(blueprints) > 0:
            template_type = blueprints.pop()
            if template_type not in dependencies:
                blueprint = self.get(template_type)
                for dependency in self.get_dependencies(blueprint):
                    if dependency not in dependencies:
                        dependencies[template_type].add(dependency)
                        blueprints.append(dependency)
                        _blueprint = self.get(dependency)
        for _blueprint, _dependencies in dependencies.items():
            dependencies[_blueprint] = _dependencies - {_blueprint}

        return dependencies

    @staticmethod
    def get_dependencies(blueprint) -> List[str]:
        dependencies = [blueprint._type]
        try:
            for attribute in blueprint.attributes:
                if not is_simple(attribute):
                    dependencies.append(attribute.attribute_type)
        except AttributeError:
            pass
        return dependencies

    def process_request(self, request_object: GeneratePythonCodeRequestObject):
        document_id: str = request_object.document_id
        data_source_id: str = request_object.data_source_id

        blueprint: DTO = self.document_repository.get(document_id)
        if not blueprint:
            raise EntityNotFoundException(uid=document_id)

        memory_file = io.BytesIO()
        prefix = "dmt"
        with zipfile.ZipFile(memory_file, mode="w") as zip_file:

            def _dump(file_name: str, data: Union[str, bytes], encoding: str = "UTF-8") -> None:
                """ Borrowed from git.equinor.com/APS/GUI """
                file_name = file_name.replace("-", "_")  # Ensure package names are 'import friendly'
                with zip_file.open(file_name, "w") as f:
                    if isinstance(data, str):
                        data = data.encode(encoding)
                    if not data or data[-1] != b"\n":
                        data += b"\n"
                    f.write(data)

            def write(template_type, blueprint, include_dependencies: bool = False, format_code: bool = True) -> None:
                path = f"{prefix}/{template_type}{'' if template_type.endswith('.py') else '.py'}"
                if path not in zip_file.namelist():
                    if isinstance(blueprint, str):
                        content = blueprint
                    else:
                        content = blueprint.__code__(
                            include_dependencies=include_dependencies, format_code=format_code
                        )
                    _dump(path, content)

            # Export stringcase
            write("stringcase.py", get_stringcase())
            if is_package(blueprint):
                # Export the DTO class
                write("classes/dto.py", get_dto())
                blueprints = self.get_dependency_graph(blueprint, data_source_id)
                for template_type, dependencies in blueprints.items():
                    write(template_type, blueprint=self.get(template_type))
                    for dependency in dependencies:
                        write(dependency, blueprint=self.get(dependency))
            else:
                _blueprint = self.from_schema(blueprint.data)
                write(blueprint.name, _blueprint, include_dependencies=True)

        memory_file.seek(0)

        return res.ResponseSuccess(memory_file)

    def from_schema(self, schema: dict, template_type: Optional[str] = None):
        if template_type is None:
            template_type = schema["name"]
        if "_id" in schema:
            del schema["_id"]
        return self._factory.create_from_schema(schema, template_type)

    def get(self, template_type):
        return self._factory.create(template_type)

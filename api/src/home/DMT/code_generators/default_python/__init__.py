from __future__ import annotations

import io
import zipfile
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Set, Union

from domain_classes.dto import DTO
from domain_classes.schema import Factory, get_dto
from enums import SIMOS
from restful import request_object as req


def get(obj, attr: str):
    if isinstance(obj, dict):
        return obj[attr]
    return getattr(obj, attr)


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

        return cls(document_id=adict.get("documentId"), data_source_id=adict.get("dataSourceId"))


def is_package(blueprint: DTO):
    return blueprint.type == SIMOS.PACKAGE.value


def is_simple(attribute) -> bool:
    attribute_type = get(attribute, "attribute_type")
    return attribute_type in ["string", "number", "integer", "boolean"]


def get_stringcase() -> str:
    import stringcase

    with open(stringcase.__file__) as f:
        content = "\n".join(f.readlines())
    return content


class Node:
    def __init__(self, content: Optional[str], children: Optional[Sequence[Node]] = None):
        self.content = content
        self.parents: Set[Node] = set()
        self.children: Set[Node] = set()
        for child in children or []:
            self.add(child)

    def add(self, child: Node) -> None:
        child.parents.add(self)
        if child not in self.children:
            self.children.add(child)

    def remove(self, child: Node) -> None:
        if child in self.children:
            child.parents -= {self}
            self.children -= {child}

    def __str__(self):
        return f"{self.__class__.__name__}(content={self.content})"


class Nodes(list):
    def __init__(self, *args: List[Node]):
        super().__init__(*args)

    def pop(self, **kwargs) -> Node:
        node: Node = super().pop()
        for child in list(node.children):  # Ensure that the underlying set may be changed
            child.parents -= {node}
        return node


def create_graph(dependencies: Dict[str, Set[str]]) -> Dict[str, Node]:
    nodes: Dict[str, Node] = {}

    def create_node(name) -> Node:
        try:
            return nodes[name]
        except KeyError:
            _node = Node(name)
            nodes[name] = _node
            return _node

    for template_type, children in dependencies.items():
        node = create_node(template_type)
        for child in children:
            node.add(create_node(child))

    return nodes


def topological_sort(dependencies: Dict[str, Set[str]]) -> List[str]:
    """An implementation of [Khan's algorithm](https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm)"""
    nodes = create_graph(dependencies)
    roots = Nodes([node for node in nodes.values() if not node.parents])
    ordering = []

    def pop() -> Node:
        node = roots.pop()
        del nodes[node.content]
        return node

    while len(roots) > 0:
        node = pop()
        ordering.append(node.content)
        for child in node.children:
            if not child.parents:
                roots.append(child)
    # We may still have circular dependencies.
    # Due to how they are begotten, the "main" dependency is likely the first in the remaining nodes
    return ordering + list(nodes.keys())


def get_stub_import(template_type: str, blueprint: type) -> str:
    # Same as in the `__code__` method of the generated code
    import_path = template_type.replace("/", ".").replace("-", "_")
    return f"from {import_path} import {blueprint.__name__}"


class GeneratePythonCode:
    def __init__(self, documents: Dict[str, dict]):
        self.documents = documents
        self._factory = Factory(self.documents)

    def get_blueprints(self, blueprint: dict, files: dict = None, prefix: str = "") -> Dict[str, type]:
        if files is None:
            files = {}
        if "_id" in blueprint.keys():
            del blueprint["_id"]
        name = blueprint["name"]
        if prefix:
            name = f"{prefix}/{name}"
        if is_package(blueprint):
            for reference in blueprint["content"]:
                dto = self.documents.get(reference["_id"])
                self.get_blueprints(dto, files, name)
        else:
            try:
                blueprint = self.get(name)
            except Exception:
                blueprint = self.from_schema(blueprint.data, name)
            files[name] = blueprint
        return files

    def get_dependency_graph(self) -> List[str]:
        dependencies = defaultdict(set)
        blueprints = set(self.documents.keys())
        while blueprints:
            template_type = blueprints.pop()
            if template_type not in dependencies:
                blueprint = self.get(template_type)
                for dependency in self.get_dependencies(blueprint):
                    dependencies[template_type].add(dependency)
                    if dependency not in dependencies:
                        blueprints.add(dependency)
        for _blueprint, _dependencies in dependencies.items():
            dependencies[_blueprint] = _dependencies - {_blueprint}

        return topological_sort(dependencies)

    @staticmethod
    def get_dependencies(blueprint) -> Set[str]:
        dependencies = {blueprint._type}
        try:
            for attribute in blueprint.attributes:
                if not is_simple(attribute):
                    dependencies.add(get(attribute, "attribute_type"))
        except AttributeError:
            pass
        return dependencies

    def generate(self) -> io.BytesIO:
        memory_file = io.BytesIO()
        prefix = "dmt"
        with zipfile.ZipFile(memory_file, mode="w") as zip_file:

            def _dump(file_name: str, data: Union[str, bytes], encoding: str = "UTF-8") -> None:
                """Borrowed from git.equinor.com/APS/GUI"""
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
                            include_dependencies=include_dependencies,
                            format_code=format_code,
                            include_code_generation=False,
                            include_import_of_other_blueprints=True,
                        )
                    _dump(path, content)

            # Export stringcase
            write("stringcase.py", get_stringcase())
            write("domain_classes/dto.py", get_dto())

            template_types = self.get_dependency_graph()
            lookup: Dict[type, str] = {self.get(template_type): template_type for template_type in template_types}
            package_files = self.get_package_files(template_types)
            for package_index, content in package_files.items():
                write(package_index, content)
            for template_type in template_types:
                blueprint = self.get(template_type)
                if blueprint.__has_circular_dependencies__():
                    write(template_type, blueprint, include_dependencies=True)
                    for dependency in blueprint.__circular_dependencies__():
                        dependency_type = lookup[dependency]
                        if dependency_type == template_type:
                            # Skip self-references
                            continue
                        write(dependency_type, get_stub_import(template_type, dependency))
                else:
                    write(template_type, blueprint)

        memory_file.seek(0)

        return memory_file

    def from_schema(self, schema: dict, template_type: Optional[str] = None):
        if template_type is None:
            template_type = schema["name"]
        if "_id" in schema:
            del schema["_id"]
        return self._factory.create_from_schema(schema, template_type)

    def get(self, template_type):
        return self._factory.create(template_type)

    def get_package_files(self, template_types: List[str]) -> Dict[str, str]:
        packages = defaultdict(str)
        for template_type in template_types:
            package = Path(template_type).parent / "__init__.py"
            packages[f"{package}"] += f"{get_stub_import(template_type, blueprint=self.get(template_type))}\n"
        return packages


def main(documents: Dict[str, dict]) -> io.BytesIO:
    code_generator = GeneratePythonCode(documents)
    return code_generator.generate()

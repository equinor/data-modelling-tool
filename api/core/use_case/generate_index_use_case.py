from core.domain.blueprint import Blueprint
from core.repository.interface.package_repository import PackageRepository
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.use_case.utils.get_template import get_template
from utils.logging import logger
from anytree import NodeMixin, RenderTree, PreOrderIter


class Node(NodeMixin):
    def __init__(self, data_source_id, name, document=None, blueprint=None, parent=None, children=None):
        self.data_source_id = data_source_id
        self.name = name
        self.document = document
        self.blueprint = blueprint
        self.parent = parent
        if children:
            self.children = children

    @property
    def uid(self):
        if self.document:
            return self.document.uid

    @property
    def start_path(self):
        return "/".join([node.name for node in self.path])


class DataSourceNode(Node):
    def __init__(self, data_source_id, name):
        super().__init__(data_source_id, name)

    @property
    def id(self):
        return self.data_source_id

    def to_node(self):
        return {
            "id": self.id,
            "title": self.name,
            "nodeType": "datasource",
            "children": [child.to_node()["id"] for child in self.children],
        }


class EntityPlaceholderNode(Node):
    def __init__(self, data_source_id, name, document, blueprint, parent, type):
        super().__init__(data_source_id, name, document, blueprint, parent)
        self.type = type

    def find_root_uid(self, node):
        if not node:
            return ""

        if node.document and node.document.uid:
            return node.document.uid

        return self.find_root_uid(node.parent)

    @property
    def id(self):
        # If the document is created, use that value, if not use parent id
        # uid = self.document.uid if self.document else self.find_root_uid(self.parent)
        uid = self.find_root_uid(self.parent)
        return f"{self.data_source_id}/{uid}_{self.name}"

    def to_node(self):
        return {
            "parentId": self.parent.id,
            "filename": self.name,
            "title": self.name,
            "id": self.id,
            "nodeType": "document-ref",
            "templateRef": self.type,
            "attributePath": "",
            "children": [child.to_node()["id"] for child in self.children],
        }


class ArrayPlaceholderNode(Node):
    """
    A class used as a placeholder for documents.

    Attributes
    ----------
    item_type : str
        specify the kind of item type we can add to this array
    """

    def __init__(
        self,
        data_source_id: str,
        name: str,
        document: Blueprint,
        blueprint: Blueprint,
        item_type: Blueprint,
        parent: Node = None,
    ):
        super().__init__(data_source_id, name, document, blueprint, parent)
        self.item_type = item_type

    @property
    def id(self):
        if self.parent.document:
            return f"{self.data_source_id}/{self.parent.document.uid}_{self.name}"
        else:
            return ""

    def to_node(self):
        return {
            "parentId": self.parent.id,
            "filename": self.name,
            "title": self.name,
            "id": self.id,
            "nodeType": "array-placeholder",
            "children": [child.to_node()["id"] for child in self.children],
            "meta": {
                "itemType": self.blueprint.type,
                "itemName": self.item_type.name,
                "attribute": self.name,
                "parentId": f"{self.parent.document.uid if self.parent.document else ''}",
                "dataSourceId": self.data_source_id,
            },
        }


class FolderNode(Node):
    def __init__(self, data_source_id, name, document, blueprint, parent=None, children=None):
        super().__init__(data_source_id, name, document, blueprint, parent, children)
        pass

    @property
    def id(self):
        return f"{self.data_source_id}/{self.document.uid}"

    def to_node(self):
        return {
            "parentId": self.parent.id,
            "filename": self.name,
            "title": self.name,
            "id": self.id,
            "nodeType": "subpackage",
            "children": [child.to_node()["id"] for child in self.children],
        }


class FileNode(Node):
    def __init__(self, data_source_id, name, document, blueprint, parent=None, children=None):
        super().__init__(data_source_id, name, document, blueprint, parent, children)
        pass

    @property
    def id(self):
        return f"{self.data_source_id}/{self.document.uid}"

    def to_node(self):
        return {
            "parentId": self.parent.id,
            "filename": self.name,
            "title": self.name,
            "id": self.id,
            "nodeType": "file",
            "children": [child.to_node()["id"] for child in self.children],
        }


class PackageNode(Node):
    def __init__(self, data_source_id, name, document, blueprint, parent=None, children=None):
        super().__init__(data_source_id, name, document, blueprint, parent, children)
        pass

    @property
    def id(self):
        return f"{self.start_path}/{self.document.uid}"

    def to_node(self):
        print(self.start_path)
        return {
            "parentId": self.parent.id,
            "filename": self.name,
            "title": self.name,
            "id": self.id,
            "nodeType": "package",
            "children": [child.to_node()["id"] for child in self.children],
        }


class Index:
    def __init__(self, data_source_id: str):
        self.data_source_id = data_source_id
        self.index = {}

    def add(self, adict):
        self.index[adict["id"]] = adict

    def to_dict(self):
        return self.index


def print_tree(root_node):
    for pre, fill, node in RenderTree(root_node):
        treestr = "%s%s" % (pre, node.name)
        print(treestr.ljust(8), node.uid, node.to_node()["nodeType"])


class Tree:
    def __init__(self, blueprint_repository: MongoBlueprintRepository, get_repository):
        self.blueprint_repository = blueprint_repository
        self.get_repository = get_repository

    def _add_document(self, data_source_id: str, document: Blueprint, parent_node):
        child_node = FileNode(
            data_source_id=data_source_id,
            name=document.name,
            document=document,
            blueprint=get_template(self.get_repository, document.type),
            parent=parent_node,
        )
        self._add_attributes(data_source_id, child_node)

    def _add_package(self, data_source_id: str, document: Blueprint, parent_node):
        child_node = FolderNode(
            data_source_id=data_source_id,
            name=document.name,
            document=document,
            blueprint=get_template(self.get_repository, document.type),
            parent=parent_node,
        )
        self._add_attributes(data_source_id, child_node)

    def _add_references(self, data_source_id, references, parent_node, attribute_name, attribute_type):
        index = 0
        for ref in references:
            logger.info(ref)
            if isinstance(ref, dict) and ref["type"] == "ref":
                logger.warn(f"Add ref '{ref}'")
                document = self.blueprint_repository.get(ref["_id"])
                if not document:
                    raise EntityNotFoundException(uid=ref)
                self._add_document(data_source_id, document, parent_node)
            elif isinstance(ref, dict):
                primitives = ["string", "number", "integer", "number", "boolean"]
                if ref["type"] not in primitives:
                    if "value" in ref:
                        logger.info(f"Add reference dict for '{ref['name']}'")
                        document = get_template(self.get_repository, ref["value"])
                        if not document:
                            raise EntityNotFoundException(uid=ref["value"])
                        if document.type == "templates/package":
                            self._add_package(data_source_id, document, parent_node)
                        else:
                            self._add_document(data_source_id, document, parent_node)
                    else:
                        blueprint = get_template(self.get_repository, ref["type"])
                        if blueprint:
                            attribute_node = EntityPlaceholderNode(
                                data_source_id=data_source_id,
                                name=f"{attribute_name}.{index}",  # .{ref['name']}
                                document=None,
                                blueprint=blueprint,
                                parent=parent_node,
                                type=attribute_type,
                            )
                            self._add_attributes(data_source_id, attribute_node)
                else:
                    EntityPlaceholderNode(
                        data_source_id=data_source_id,
                        name=f"{attribute_name}.{index}",
                        document=None,
                        blueprint=None,
                        parent=parent_node,
                        type=attribute_type,
                    )

            else:
                # TODO: Replace this type with only using dict structure above
                logger.warn(f"Add reference single for '{ref}'")
                document = self.blueprint_repository.find_one(name=ref)
                if not document:
                    raise EntityNotFoundException(uid=ref)
                self._add_document(data_source_id, document, parent_node)

            index += 1

    def _add_attributes(self, data_source_id, parent_node):
        logger.info(f"Add attributes for '{parent_node.name}'")

        # document instance
        document = parent_node.document
        # type instance
        blueprint = parent_node.blueprint

        if not blueprint:
            raise EntityNotFoundException(uid=document.type)

        # Use the blueprint to find attributes that contains references
        for attribute in blueprint.get_attributes_with_reference():
            name = attribute["name"]
            # What blueprint is this attribute pointing too

            # If the attribute is an array
            if "dimensions" in attribute and attribute["dimensions"] == "*":
                # Create a placeholder node that can contain real documents
                attribute_node = ArrayPlaceholderNode(
                    data_source_id=data_source_id,
                    name=name,
                    document=document,
                    blueprint=blueprint,
                    parent=parent_node,
                    # type = specify what kind of type we can add to this array
                    item_type=get_template(self.get_repository, attribute["type"]),
                )
                # Check if values for the attribute exists in current document,
                # this means that we have added some documents to this array
                if hasattr(document, name):
                    values = getattr(document, name)
                    self._add_references(data_source_id, values, attribute_node, name, attribute["type"])
            # If the attribute is a single reference
            else:
                blueprint = get_template(self.get_repository, attribute["value"])
                # document = Blueprint(**document.form_data[name]) if document and name in document.form_data else None
                # if document:
                #    document.template_ref = attribute["value"]
                attribute_node = EntityPlaceholderNode(
                    data_source_id=data_source_id,
                    name=name,
                    document=None,
                    blueprint=blueprint,
                    parent=parent_node,
                    type=attribute["value"],
                )

                self._add_attributes(data_source_id, attribute_node)

    def generate(self, data_source_id: str, data_source_name: str, document) -> Index:
        root_node = DataSourceNode(data_source_id=data_source_id, name=data_source_name)

        node = FolderNode(
            data_source_id=data_source_id,
            name=document.name,
            document=document,
            blueprint=get_template(self.get_repository, document.type),
            parent=root_node,
        )
        self._add_attributes(data_source_id, node)

        return root_node


class GenerateIndexUseCase:
    def __init__(
        self, blueprint_repository: MongoBlueprintRepository, package_repository: PackageRepository, get_repository
    ):
        self.blueprint_repository = blueprint_repository
        self.package_repository = package_repository
        self.get_repository = get_repository

        self.tree = Tree(blueprint_repository=blueprint_repository, get_repository=get_repository)

    def execute(self, data_source_id: str, data_source_name: str) -> Index:
        index = Index(data_source_id=data_source_id)

        root_node = DataSourceNode(data_source_id=data_source_id, name=data_source_name)

        for package in self.package_repository.list():
            root_node = self.tree.generate(data_source_id, data_source_name, package)

        print_tree(root_node)

        for node in PreOrderIter(root_node):
            index.add(node.to_node())

        return index

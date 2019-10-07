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

        if document is None:
            self.document = None
        self.document = document
        if blueprint is None:
            self.blueprint = None
        self.blueprint = blueprint
        if parent is None:
            self.parent = None
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


class DocumentNode(Node):
    """
    A class used...

    Attributes
    ----------
    item_type : str
        specify the kind of item type we can add to this array
    """

    def __init__(
        self,
        data_source_id: str,
        name: str,
        menu_items,
        on_select=None,
        document: Blueprint = None,
        blueprint: Blueprint = None,
        parent: Node = None,
    ):
        super().__init__(data_source_id, name, document, blueprint, parent)
        if not menu_items:
            self.menu_items = []
        if not on_select:
            self.on_select = None

        self.on_select = on_select
        self.menu_items = menu_items

    @property
    def id(self):
        if self.document:
            return f"{self.start_path}/{self.document.uid}"
        else:
            return self.data_source_id

    @property
    def onSelect(self):
        if self.on_select:
            return {
                "uid": self.id,
                "title": self.name,
                "component": self.on_select,
                "data": {
                    "dataUrl": f"/api/v2/documents/{self.data_source_id}/{self.document.uid}",
                    "schemaUrl": f"/api/v2/json-schema/{self.blueprint.type}",
                },
            }

    def to_node(self):
        result = {
            "parentId": None if not self.parent else self.parent.id,
            "filename": self.name,
            "title": self.name,
            "id": self.id,
            "nodeType": "document-node",
            "children": [child.to_node()["id"] for child in self.children],
            "type": "datasource" if not self.document else self.document.type,
            "meta": {"menuItems": self.menu_items, "onSelect": self.onSelect},
        }
        return result


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
        print(treestr.ljust(8), node.uid, node.to_node()["nodeType"], node.document.type if node.document else "")


class Tree:
    def __init__(self, blueprint_repository: MongoBlueprintRepository, get_repository):
        self.blueprint_repository = blueprint_repository
        self.get_repository = get_repository

    def _add_document(self, data_source_id: str, document: Blueprint, parent_node, attribute_name):
        child_node = DocumentNode(
            data_source_id=data_source_id,
            name=document.name,
            document=document,
            blueprint=get_template(self.get_repository, document.type),
            parent=parent_node,
            menu_items=[
                {
                    "label": "Remove",
                    "action": "DELETE",
                    "data": {
                        "url": f"/api/v2/explorer/{data_source_id}/remove-file",
                        "prompt": {"title": "Are you sure?", "content": "Would you like to remove this item?"},
                        "request": {
                            "parentId": parent_node.document.uid,
                            "name": document.name,
                            "attribute": attribute_name,
                        },
                    },
                }
            ],
        )
        self._add_attributes(data_source_id, child_node)

    def _add_package(self, data_source_id: str, document: Blueprint, parent_node):
        child_node = DocumentNode(
            data_source_id=data_source_id,
            name=document.name,
            document=document,
            blueprint=get_template(self.get_repository, document.type),
            parent=parent_node,
            menu_items=[],
        )
        self._add_attributes(data_source_id, child_node)

    def _add_references(self, data_source_id, references, parent_node, attribute_name, attribute_type):
        index = 0
        for ref in references:
            if "type" not in ref:
                logger.warn(f"Missing type for ref {ref}")
                continue

            if isinstance(ref, dict) and ref["type"] == "ref":
                logger.warn(f"Add ref '{ref}'")
                document = self.blueprint_repository.get(ref["_id"])
                if not document:
                    raise EntityNotFoundException(uid=ref)
                self._add_document(data_source_id, document, parent_node, attribute_name)
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
                            self._add_document(data_source_id, document, parent_node, attribute_name)
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
                item_type = get_template(self.get_repository, attribute["type"])
                # Create a placeholder node that can contain real documents

                attribute_node = DocumentNode(
                    data_source_id=data_source_id,
                    name=name,
                    document=document,
                    blueprint=blueprint,
                    parent=parent_node,
                    menu_items=[
                        {
                            "label": "New",
                            "menuItems": [
                                {
                                    "label": f"{item_type.name}",
                                    "action": "CREATE",
                                    "data": {
                                        "url": f"/api/v2/explorer/{data_source_id}/add-file",
                                        "schemaUrl": f"/api/v2/json-schema/{blueprint.type}",
                                        "request": {
                                            "type": f"{blueprint.type}",
                                            "parentId": document.uid,
                                            "attribute": name,
                                        },
                                    },
                                }
                            ],
                        }
                    ],
                )
                # Check if values for the attribute exists in current document,
                # this means that we have added some documents to this array
                if hasattr(document, name):
                    values = getattr(document, name)
                    if "type" in attribute:
                        self._add_references(data_source_id, values, attribute_node, name, attribute["type"])
                    else:
                        logger.warn(f"Missing type {attribute}")
            # If the attribute is a single reference
            else:
                blueprint = get_template(self.get_repository, attribute["type"])
                # document = Blueprint(**document.form_data[name]) if document and name in document.form_data else None
                # if document:
                #    document.template_ref = attribute["value"]
                attribute_node = EntityPlaceholderNode(
                    data_source_id=data_source_id,
                    name=name,
                    document=None,
                    blueprint=blueprint,
                    parent=parent_node,
                    type=attribute["type"],
                )

                self._add_attributes(data_source_id, attribute_node)

    def generate(self, data_source_id: str, document, root_node) -> Index:
        blueprint = get_template(self.get_repository, document.type)
        node = DocumentNode(
            data_source_id=data_source_id,
            name=document.name,
            document=document,
            blueprint=blueprint,
            parent=root_node,
            on_select="blueprint",
            menu_items=[
                {
                    "label": "New",
                    "menuItems": [
                        {
                            "label": "Package",
                            "action": "CREATE",
                            "data": {
                                "url": f"/api/v2/explorer/{data_source_id}/add-file",
                                "dataUrl": f"/api/v2/documents/{data_source_id}/{document.uid}",
                                "schemaUrl": f"/api/v2/json-schema/{blueprint.type}",
                                "request": {
                                    "itemType": "templates/package",
                                    "itemName": "Package",
                                    "parentId": data_source_id,
                                },
                            },
                        }
                    ],
                },
                {
                    "label": "Rename",
                    "action": "UPDATE/RENAME",
                    "data": {
                        "url": f"/api/v2/explorer/move-file",
                        "dataUrl": f"/api/v2/documents/{data_source_id}/{document.uid}",
                        "schemaUrl": f"/api/v2/json-schema/templates/actions/rename",
                        "request": {
                            "source": f"{data_source_id}/{document.name}",
                            "destination": f"{data_source_id}/<FORM_DATA_NAME>",
                        },
                    },
                },
                {
                    "label": "Remove",
                    "action": "DELETE",
                    "data": {
                        "url": f"/api/v2/explorer/{data_source_id}/remove-package",
                        "prompt": {"title": "Are you sure?", "content": "Would you like to remove this item?"},
                        "request": {"parentId": data_source_id, "name": document.name},
                    },
                },
            ],
        )
        self._add_attributes(data_source_id, node)


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

        root_node = DocumentNode(data_source_id=data_source_id, name=data_source_name, menu_items=[])

        for package in self.package_repository.list():
            self.tree.generate(data_source_id, package, root_node)

        print_tree(root_node)

        for node in PreOrderIter(root_node):
            index.add(node.to_node())

        return index

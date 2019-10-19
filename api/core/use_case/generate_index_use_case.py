from pathlib import Path

from core.domain.blueprint import Blueprint
from core.domain.entity import Entity
from core.domain.storage_recipe import StorageRecipe
from core.repository.interface.package_repository import PackageRepository
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.shared.templates import DMT, SIMOS
from core.use_case.utils.get_storage_recipe import get_storage_recipe
from core.use_case.utils.get_template import get_blueprint
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
        elif self.depth == 0:
            return self.data_source_id
        else:
            return "WRONG!"

    def to_node(self):
        result = {
            "parentId": None if not self.parent else self.parent.id,
            "filename": self.name,
            "title": self.name,
            "id": self.id,
            "nodeType": "document-node",
            "children": [child.to_node()["id"] for child in self.children],
            "type": "datasource" if not self.document else self.document.type,
            "meta": {"menuItems": self.menu_items, "onSelect": self.on_select},
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
    def __init__(
        self, blueprint_repository: MongoBlueprintRepository, get_repository, package_repository, document_repository
    ):
        self.blueprint_repository = blueprint_repository
        self.get_repository = get_repository
        self.package_repository = package_repository
        self.document_repository = document_repository

    def get_references(self, references, item_type):
        documents = []
        for ref in references:

            if isinstance(ref, dict):
                logger.warn(f"Add ref '{ref}' {item_type}")
                if item_type == DMT.PACKAGE.value:
                    document = self.package_repository.get(ref["_id"])
                    # document.packages = [{"name": p.name, "type": p.type, "_id": p.uid} for p in document.packages]
                elif item_type == SIMOS.BLUEPRINT.value:
                    document = self.blueprint_repository.get(ref["_id"])
                else:
                    dto = self.document_repository.get(ref["_id"])
                    document = Entity(dto.data)
                    document.uid = dto.uid

                if not document:
                    raise EntityNotFoundException(uid=ref)
                documents.append(document)

        return documents

    def generate_contained_nodes(
        self, data_source_id, document_id, document_path, attribute_type, values, parent_node
    ):
        print(f"adding {attribute_type} to {'.'.join(document_path)}")
        for index, instance in enumerate(values):
            if isinstance(instance, dict):
                uid = f"{document_id}.{'.'.join(document_path)}.{instance['name']}"
                current_path = document_path + [f"{index}"]

                node = DocumentNode(
                    data_source_id=data_source_id,
                    name=instance["name"],
                    document=Blueprint(uid=uid, name=instance["name"], description="", type=attribute_type),
                    blueprint=None,
                    parent=parent_node,
                    on_select={
                        "uid": uid,
                        "title": instance["name"],
                        "component": "blueprint",
                        "data": {
                            "dataUrl": f"/api/v2/documents/{data_source_id}/{document_id}",
                            "schemaUrl": f"/api/v2/json-schema/{attribute_type}",
                            "attribute": ".".join(current_path),
                        },
                    },
                    menu_items=[],
                )
                blueprint = get_blueprint(attribute_type)
                for attribute in blueprint.get_attributes_with_reference():
                    name = attribute["name"]

                    is_contained_in_ui = attribute["contained"] if "contained" in attribute else False
                    if is_contained_in_ui:
                        continue

                    if name in instance:
                        self.generate_contained_nodes(
                            data_source_id,
                            document_id,
                            current_path + [f"{name}"],
                            attribute["type"],
                            instance[name],
                            node,
                        )

    def process_document(self, data_source_id, document, parent_node):
        logger.info(f"Add attributes for '{document.name}'")

        blueprint = get_blueprint(document.type)

        parent_attribute = Path(parent_node.start_path)

        node = DocumentNode(
            data_source_id=data_source_id,
            name=document.name,
            document=document,
            blueprint=blueprint,
            parent=parent_node,
            on_select={
                "uid": document.uid,
                "title": document.name,
                "component": "blueprint",
                "data": {
                    "dataUrl": f"/api/v2/documents/{data_source_id}/{document.uid}",
                    "schemaUrl": f"/api/v2/json-schema/{document.type}",
                },
            },
            menu_items=[
                {
                    "label": "Rename",
                    "action": "UPDATE",
                    "data": {
                        "url": f"/api/v2/explorer/move-file",
                        "dataUrl": f"/api/v2/documents/{data_source_id}/{document.uid}",
                        "schemaUrl": f"/api/v2/json-schema/templates/DMT/actions/RenameAction",
                        "request": {
                            "source": f"{data_source_id}/{document.name}",
                            "destination": f"{data_source_id}/" + "${name}",
                        },
                    },
                },
                {
                    "label": "Remove",
                    "action": "DELETE",
                    "data": {
                        "url": f"/api/v2/explorer/{data_source_id}/remove-file",
                        "prompt": {"title": "Are you sure?", "content": "Would you like to remove this item?"},
                        "request": {
                            "parentId": parent_node.uid,
                            "name": document.name,
                            "attribute": parent_attribute.name,
                        },
                    },
                },
            ],
        )

        if not blueprint:
            raise EntityNotFoundException(uid=document.type)

        storage_recipe: StorageRecipe = get_storage_recipe(blueprint)

        attribute_nodes = []
        # Use the blueprint to find attributes that contains references
        for attribute in blueprint.get_attributes_with_reference():
            name = attribute["name"]
            # What blueprint is this attribute pointing too

            is_contained_in_storage = storage_recipe.is_contained(attribute["name"], attribute["type"])

            is_contained_in_ui = attribute["contained"] if "contained" in attribute else False
            if is_contained_in_ui:
                continue

            print(f"------------------------{document.name}:{name}:{is_contained_in_storage}------------------------")

            # If the attribute is an array
            if attribute.get("dimensions", "") == "*":
                item_type = get_blueprint(attribute["type"])

                # TODO: This is hard coded now...
                add_file_type = "add-entity-file" if item_type.name == "Entity" else "add-file"
                data = {}
                for item in item_type.get_attribute_names():
                    data[item] = ("${" + item + "}",)

                not_contained_menu_action = {
                    "label": "New",
                    "menuItems": [
                        {
                            "label": f"{item_type.name}",
                            "action": "CREATE",
                            "data": {
                                "url": f"/api/v2/explorer/{data_source_id}/{add_file_type}",
                                "schemaUrl": f"/api/v2/json-schema/{attribute['type']}?ui_recipe=DEFAULT_CREATE",
                                "nodeUrl": f"/api/v3/index/{data_source_id}",
                                "request": {
                                    "type": attribute["type"],
                                    "parentId": getattr(document, "uid", None),
                                    "attribute": name,
                                    "name": "${name}",
                                    "data": data,
                                },
                            },
                        }
                    ],
                }

                contained_menu_action = {
                    "label": "New",
                    "menuItems": [
                        {
                            "label": f"{item_type.name}",
                            "action": "CREATE",
                            "data": {
                                "url": f"/api/v2/explorer/{data_source_id}/{add_file_type}",
                                "schemaUrl": f"/api/v2/json-schema/{attribute['type']}?ui_recipe=DEFAULT_CREATE",
                                "request": {
                                    "type": attribute["type"],
                                    "parentId": getattr(document, "uid", None),
                                    "attribute": name,
                                    "data": data,
                                    "name": "${name}",
                                },
                            },
                        }
                    ],
                }

                # Create a placeholder node that can contain real documents
                attribute_node = DocumentNode(
                    data_source_id=data_source_id,
                    name=name,
                    document=document,
                    blueprint=blueprint,
                    parent=node,
                    menu_items=[contained_menu_action if is_contained_in_storage else not_contained_menu_action],
                )

                # Check if values for the attribute exists in current document,
                # this means that we have added some documents to this array.
                values = document.get_values(name)
                if values:
                    # Values are stored in separate document
                    if not is_contained_in_storage:
                        # Get real documents
                        attribute_nodes.append(
                            {"documents": self.get_references(values, attribute["type"]), "node": attribute_node}
                        )
                    # Values are stored inside parent. We create placeholder nodes.
                    if is_contained_in_storage:
                        self.generate_contained_nodes(
                            data_source_id, document.uid, [name], attribute["type"], values, attribute_node
                        )

        for attribute_node in attribute_nodes:
            for attribute_document in attribute_node["documents"]:
                self.process_document(
                    data_source_id=data_source_id, document=attribute_document, parent_node=attribute_node["node"]
                )

    def execute(self, data_source_id: str, data_source_name: str, packages) -> Index:

        index = Index(data_source_id=data_source_id)

        root_node = DocumentNode(
            data_source_id=data_source_id,
            name=data_source_name,
            menu_items=[
                {
                    "label": "New",
                    "menuItems": [
                        {
                            "label": "Package",
                            "action": "CREATE",
                            "data": {
                                "url": f"/api/v2/explorer/{data_source_id}/add-root-package",
                                "schemaUrl": f"/api/v2/json-schema/{DMT.PACKAGE.value}?ui_recipe=DEFAULT_CREATE",
                                "nodeUrl": f"/api/v3/index/{data_source_id}",
                                "request": {"name": "${name}"},
                            },
                        }
                    ],
                }
            ],
        )

        for package in packages:
            self.process_document(data_source_id, package, root_node)

        print_tree(root_node)

        for node in PreOrderIter(root_node):
            index.add(node.to_node())

        return index


class GenerateIndexUseCase:
    def __init__(
        self,
        blueprint_repository: MongoBlueprintRepository,
        package_repository: PackageRepository,
        get_repository,
        document_repository,
    ):
        self.blueprint_repository = blueprint_repository
        self.package_repository = package_repository
        self.get_repository = get_repository
        self.document_repository = document_repository

        self.tree = Tree(
            blueprint_repository=blueprint_repository,
            package_repository=package_repository,
            get_repository=get_repository,
            document_repository=document_repository,
        )

    def execute(self, data_source_id: str, data_source_name: str) -> Index:
        packages = []
        for package in self.package_repository.list():
            # TODO: Make Indexer Handle Package Class
            package.packages = [{"name": p.name, "_id": p.uid} for p in package.packages]
            packages.append(package)

        return self.tree.execute(data_source_id=data_source_id, data_source_name=data_source_name, packages=packages)

    def single(self, data_source_id: str, data_source_name: str, document_id: str) -> Index:
        document = self.document_repository.get(document_id)
        # The tree can't handle dto, need to use one of the below
        if document.type == DMT.PACKAGE.value:
            document = self.package_repository.get(document.uid)
        elif document.type == SIMOS.BLUEPRINT.value:
            document = self.blueprint_repository.get(document.uid)
        else:
            dto = self.document_repository.get(document.uid)
            document = Entity(dto.data)
            document.uid = dto.uid

        data = self.tree.execute(
            data_source_id=data_source_id, data_source_name=data_source_name, packages=[document]
        ).to_dict()
        del data[data_source_id]
        return data

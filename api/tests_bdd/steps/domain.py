from behave import given

from classes.data_source import DataSource
from core.domain.blueprint import Blueprint
from core.domain.dto import DTO
from core.domain.package import Package
from core.repository.interface.document_repository import DocumentRepository
from core.repository.interface.package_repository import PackageRepository
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from anytree import NodeMixin, RenderTree
from core.repository.repository_factory import get_repository
from core.enums import RepositoryType, DMT, SIMOS


class TreeNode(NodeMixin):
    def __init__(self, uid, name, parent, description, type, is_root=False, **kwargs):
        self.uid = uid
        self.name = name
        self.parent = parent
        self.type = type
        self.description = description
        self.dmt_is_root = is_root

    def extra(self):
        if self.type == DMT.PACKAGE.value:
            content = []
            for child in self.children:
                # Always contained
                content.append({"_id": child.uid, "name": child.name})
            return {"content": content}
        return {}


def generate_tree_from_rows(node: TreeNode, rows):
    if len(rows) == 0:
        return node

    # Add children to this node
    children = []
    for row in rows:
        if row["parent_uid"] == node.uid:
            children.append(TreeNode(**row.as_dict(), parent=node))

    # Does the created children also have more children?
    for child in children:
        # Remove child from list before passing down
        filtered = list(filter(lambda i: i["uid"] != node.uid, rows))
        generate_tree_from_rows(child, filtered)

    return node


class Tree:
    def __init__(self, data_source_id, table):
        self.data_source = DataSource(id=data_source_id)
        self.table = table
        self.root = self._generate_tree()

    def add(self):
        blueprint_repository: MongoBlueprintRepository = get_repository(
            RepositoryType.BlueprintRepository, self.data_source
        )
        package_repository: PackageRepository = get_repository(RepositoryType.PackageRepository, self.data_source)
        document_repository: DocumentRepository = get_repository(RepositoryType.DocumentRepository, self.data_source)
        for pre, fill, node in RenderTree(self.root):
            if node.type == SIMOS.BLUEPRINT.value:
                document = DTO(
                    uid=node.uid, data=Blueprint(name=node.name, description=node.description, type=node.type)
                )
                blueprint_repository.add(document)
                print(f"Added blueprint {document.uid}")
            elif node.type == DMT.PACKAGE.value:
                package = Package(
                    name=node.name, description=node.description, type=node.type, is_root=node.dmt_is_root
                )
                extra = node.extra()
                package.content = extra["content"]
                package = DTO(package, uid=node.uid)
                package_repository.add(package)
                print(f"Added package {package.uid}")
            else:
                document: DTO = DTO(
                    uid=node.uid, data={"name": node.name, "description": node.description, "type": node.type}
                )
                document_repository.add(document)
                print(f"Added document {document.uid}")

    def print_tree(self):
        for pre, fill, node in RenderTree(self.root):
            treestr = "%s%s" % (pre, node.name)
            print(treestr.ljust(8), f"uid = {node.uid}")

    def _generate_tree(self):
        # This node is used for prefixing everything with data source
        root_node = TreeNode(uid=None, name=self.data_source.name, description="", type="", parent=None)
        package = list(filter(lambda row: row["parent_uid"] == "", self.table.rows))[0]
        if not package:
            raise Exception("Root package is not found, you need to specify root package")
        package_node = TreeNode(**package.as_dict(), parent=root_node, is_root=True)
        rows = list(filter(lambda row: row["parent_uid"] != "", self.table.rows))
        generate_tree_from_rows(package_node, rows)
        return package_node


@given('there are documents for the data source "{data_source}" in collection "{collection}"')
def step_impl_documents(context, data_source: str, collection: str):
    context.documents = {}
    tree = Tree(data_source, context.table)
    tree.print_tree()
    tree.add()

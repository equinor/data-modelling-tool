from behave import given

from classes.data_source import DataSource
from core.domain.blueprint import Blueprint
from core.domain.attribute_reference import AttributeReference
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from anytree import NodeMixin, RenderTree
from core.repository.repository_factory import get_repository, RepositoryType


class TreeNode(NodeMixin):
    def __init__(self, uid, name, parent, description, type, **kwargs):
        self.uid = uid
        self.name = name
        self.parent = parent
        self.type = type
        self.description = description

    def form_data(self):
        if self.type == "templates/v2/package":
            packages = []
            blueprints = []
            for child in self.children:
                path = "/".join([node.name for node in child.path]) if child.path else ""
                reference = AttributeReference(name=child.name, type=child.type, dimensions="", value=f"{path}")
                if reference.type == "templates/v2/blueprint":
                    blueprints.append(reference.to_dict())
                elif reference.type == "templates/v2/package":
                    packages.append(reference.to_dict())
            return {"blueprints": blueprints, "packages": packages}
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
        for pre, fill, node in RenderTree(self.root):
            document = Blueprint(uid=node.uid, name=node.name, description=node.description, template_ref=node.type)
            document.form_data = node.form_data()
            blueprint_repository.add(document)

    def print_tree(self):
        for pre, fill, node in RenderTree(self.root):
            treestr = "%s%s" % (pre, node.name)
            print(treestr.ljust(8), f"uid = {node.uid}")

    def _generate_tree(self):
        # This node is used for prefixing everything with data source
        root_node = TreeNode(uid=None, name=self.data_source.name, description="", type="", parent=None)
        package = list(filter(lambda row: row["parent_uid"] == "", self.table.rows))[0]
        if not package:
            raise Exception("Package is not found, you need to specify root")
        package_node = TreeNode(**package.as_dict(), parent=root_node)
        rows = list(filter(lambda row: row["parent_uid"] != "", self.table.rows))
        generate_tree_from_rows(package_node, rows)
        return package_node


@given('there are documents for the data source "{data_source}" in collection "{collection}"')
def step_impl_documents(context, data_source: str, collection: str):
    context.documents = {}
    tree = Tree(data_source, context.table)
    tree.print_tree()
    tree.add()

from anytree import NodeMixin, RenderTree

from classes.data_source import DataSource
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.repository_factory import get_repository, RepositoryType


class TreeNode(NodeMixin):
    def __init__(self, document, parent=None, **kwargs):
        self.document = document
        self.parent = parent

    def process(self):
        if self.document.type == "templates/DMT/Package":
            for child in self.children:
                reference = {"_id": child.document.uid, "name": child.document.name, "type": "ref"}
                if child.document.type == "templates/SIMOS/Blueprint":
                    self.document.add_blueprint(reference)
                elif child.document.type == "templates/DMT/Package":
                    self.document.add_package(reference)
                else:
                    self.document.add_blueprint(reference)


class Tree:
    def __init__(self, data_source_id):
        self.data_source = DataSource(id=data_source_id)

    def add(self, root):
        blueprint_repository: MongoBlueprintRepository = get_repository(
            RepositoryType.BlueprintRepository, self.data_source
        )
        for pre, fill, node in RenderTree(root):
            node.process()
            blueprint_repository.add(node.document)

    def print_tree(self, root):
        for pre, fill, node in RenderTree(root):
            treestr = "%s%s" % (pre, node.document.name)
            print(treestr.ljust(8), f"uid = {node.document.uid}")

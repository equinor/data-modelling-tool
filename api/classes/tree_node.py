from copy import deepcopy
from typing import Dict, List, Union

from dotted.collection import DottedDict

from classes.blueprint import Blueprint
from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO


class NodeBase:
    def __init__(self, node_id: str, parent=None, depth: int = 0):
        self.parent: Union[Node] = parent
        self.node_id: str = node_id
        self.children = []
        self.depth = depth + 1

        if parent:
            parent.children.append(self)

    def traverse(self):
        # first, yield everything every one of the child nodes would yield.
        for child in self.children:
            for item in child.traverse():
                # the two for loops is because there's multiple children,
                # and we need to iterate over each one.
                yield item

        # finally, yield self
        yield self

    def __str__(self):
        return str(f"{self.node_id} {self.depth}")

    def show_tree(self, level=0):
        print("%s%s" % ("." * level, self))
        for node in self.children:
            node.show_tree(level + 2)

    def is_array(self):
        return isinstance(self, ListNode)

    def is_single(self):
        return isinstance(self, Node)

    def to_dict(self):
        data = DottedDict({"uid": self.node_id})

        for node in self.traverse():
            if node.attribute:
                data[node.attribute.name] = node._to_dict()
            else:
                # Root nodes does not have attribute, should only get primitives
                for primitive_attribute in node.blueprint.get_primitive_types():
                    if primitive_attribute.name in node.dto.data:
                        data[primitive_attribute.name] = node.dto.data[primitive_attribute.name]

        return data.to_python()


class Node(NodeBase):
    def __init__(
            self,
            name: str,
            type: str,
            node_id: str,
            attribute: BlueprintAttribute = None,
            dto: DTO = None,
            blueprint: Blueprint = None,
            parent=None,
            depth: int = 0,
    ):
        super().__init__(node_id=node_id, parent=parent, depth=depth)
        self.node_id = node_id
        self.name = name
        self.type = type
        self.dto = dto
        self.blueprint = blueprint
        self.attribute = attribute

    def _to_dict(self):
        return self.dto.data


class ListNode(NodeBase):
    def __init__(self, name: str, node_id: str, type: str, attribute: BlueprintAttribute = None, parent=None,
                 depth: int = 0):
        super().__init__(node_id=node_id, parent=parent, depth=depth)
        self.name = name
        self.type = type
        self.attribute = attribute

    def _to_dict(self):
        return [child._to_dict() for child in self.children]

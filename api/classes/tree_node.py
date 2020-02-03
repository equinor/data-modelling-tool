from typing import Union, Dict, List
from classes.blueprint import Blueprint
from classes.dto import DTO
from utils.logging import logger


class DictExporter:
    @staticmethod
    def to_dict(node):
        data = {}

        if node.dto.uid != "":
            data["uid"] = node.dto.uid
            # TODO: Can _id be removed?
            data["_id"] = node.dto.uid

        # Primitive
        for attribute in node.blueprint.get_primitive_types():
            if attribute.name in node.dto.data:
                data[attribute.name] = node.dto.data[attribute.name]

        # Complex
        for node in node.children:
            if node.is_array():
                data[node.key] = [child.to_dict() for child in node.children]
            else:
                data[node.key] = node.to_dict()

        return data


class DictImporter:
    @classmethod
    def from_dict(cls, dto):
        return cls._from_dict(dto, "root")

    @classmethod
    def _from_dict(cls, dto, key):
        blueprint: Blueprint = Blueprint.from_dict(dto.data.pop("_blueprint"))

        node = Node(key=key, blueprint=blueprint, dto=dto)

        for attribute in blueprint.get_none_primitive_types():
            if attribute.is_array():
                children = dto.data.get(attribute.name, [])
                data = {
                    "name": attribute.name,
                    "type": attribute.attribute_type,
                    "attributeType": attribute.attribute_type,
                }
                list_node = ListNode(key=attribute.name, dto=DTO(uid="", data=data))
                for i, child in enumerate(children):
                    list_node.add_child(cls._from_dict(dto=DTO(uid=child.get("uid", ""), data=child), key=str(i)))
                node.add_child(list_node)
            else:
                if attribute.name in dto.data:
                    attribute_data = dto.data.get(attribute.name)
                    node.add_child(cls._from_dict(dto=DTO(uid=attribute_data.get("uid", ""), data=attribute_data), key=attribute.name))
                else:
                    # add empty error node.
                    empty_data = {
                        "name": attribute.name,
                        "type": "",
                        "uid": "",
                        "errorMsg": "missing attribute",
                        # blueprint is extracted in _from_dict method. name and type is needed since node from_dict is calling from_dict on the blueprint class.
                        "_blueprint": {
                            "name": "",
                            "type": "",
                        }
                    }
                    node.add_child(cls._from_dict(dto=DTO(uid=empty_data["uid"], data=empty_data), key=attribute.name))
                    logger.warning(f"Data problem: {node}")
        return node

def create_error_node(cls, attribute) -> Dict:
    return cls._from_dict(dto=DTO(uid="", data={"name": attribute.name}), key="")

class NodeBase:
    def __init__(self, key: str, dto: DTO = None, parent=None, children=None):
        if key is None:
            raise Exception("Node requires a key")

        self.key = key
        self.dto = dto

        self.parent: Union[Node, ListNode] = parent
        if parent:
            parent.add_child(self)

        self.children = []
        if children is not None:
            for child in children:
                self.add_child(child)

    @property
    def parent_node_id(self):
        if not self.parent:
            return None

        return self.parent.node_id

    @property
    def node_id(self):
        if self.dto.uid != "":
            return self.dto.uid
        else:
            path = self.path()
            return ".".join(path + [self.key])

    @property
    def name(self):
        return self.dto.name

    @property
    def type(self):
        return self.dto.type

    @property
    def attribute_type(self):
        return self.dto.attribute_type

    def path(self):
        path = []
        parent = self.parent
        while parent and parent.dto.uid == "":
            path += [parent.key]
            parent = parent.parent
        # Since we build the path "bottom-up", it need's to be revered.
        # eg. [parent, grand_parent, grand_grand_parent]
        path.reverse()
        return [parent.dto.uid] + path

    def traverse(self):
        """Iterate in pre-order depth-first search order (DFS)"""
        yield self

        # first, yield everything every one of the child nodes would yield.
        for child in self.children:
            for item in child.traverse():
                # the two for loops is because there's multiple children,
                # and we need to iterate over each one.
                yield item

    def traverse_reverse(self):
        """Iterate up the tree"""
        node = self
        while node is not None:
            yield node
            node = node.parent

    def __repr__(self):
        return "{}: {} {} {} {}".format(
            self.__class__.__name__, self.key, self.name, self.type, self.dto.uid if self.dto.uid != "" else ""
        )

    def show_tree(self, level=0):
        print("%s%s" % ("." * level, self))
        for node in self.children:
            node.show_tree(level + 2)

    def is_array(self):
        return isinstance(self, ListNode)

    def is_single(self):
        return isinstance(self, Node)

    def is_root(self):
        if self.parent is None:
            return True
        else:
            return False

    def is_leaf(self):
        if len(self.children) == 0:
            return True
        else:
            return False

    def add_child(self, child_node):
        child_node.parent = self
        self.children.append(child_node)

    def depth(self):
        """Depth of current node"""
        if self.is_root():
            return 0
        else:
            return 1 + self.parent.depth()

    def search(self, node_id: str):
        if self.node_id == node_id:
            return self

        for node in self.traverse():
            if node.node_id == node_id:
                return node

        return None

    def replace(self, node_id, new_node):
        for node in self.traverse():
            for i, n in enumerate(node.children):
                if n.node_id == node_id:
                    node.children[i] = new_node

    def update(self, data: Dict):
        if isinstance(data, dict):
            for key in data.keys():
                attribute = self.blueprint.get_attribute_by_key(key)
                if not attribute:
                    logger.error(f"Could not find attribute {key} in {self.dto.uid}")
                    continue

                if attribute.is_primitive():
                    self.dto.data[key] = data[key]
                else:
                    for child in self.children:
                        if child.key == key:
                            child.update(data[key])
        else:
            for i, item in enumerate(data):
                self.children[i].update(item)

    def has_children(self):
        return len(self.children) > 0

    def delete_child(self, keys: List) -> None:
        if len(keys) == 1:
            for index, child in enumerate(self.children):
                if child.key == keys[0]:
                    self.children.pop(index)
                    return
        try:
            next_node = next((x for x in self.children if x.key == keys[0]))
        except StopIteration:
            raise StopIteration(f"{keys[0]} not found on any children of {self.name}")
        keys.pop(0)
        next_node.delete_child(keys)

    def remove_ref(self, target_id) -> None:
        for i, c in enumerate(self.children):
            if c.node_id == target_id:
                self.children.pop(i)


class Node(NodeBase):
    def __init__(self, key: str, dto: DTO = None, blueprint: Blueprint = None, parent=None):
        super().__init__(key=key, dto=dto, parent=parent)
        self.blueprint = blueprint

    def to_dict(self):
        return DictExporter.to_dict(self)

    @staticmethod
    def from_dict(dto: DTO):
        return DictImporter.from_dict(dto)


class ListNode(NodeBase):
    def __init__(self, key: str, dto: DTO, parent=None):
        super().__init__(key=key, dto=dto, parent=parent)

    @property
    def blueprint(self):
        return self.parent.blueprint

from typing import Dict, List, Union
from uuid import uuid4

from utils.logging import logger

from classes.blueprint import Blueprint
from classes.dto import DTO


class DictExporter:
    @staticmethod
    def to_dict(node):
        data = {}

        if node.dto.uid != "":
            data["uid"] = node.dto.uid
            # TODO: Can _id be removed?
            data["_id"] = node.dto.uid

        # Primitive
        # if complex attribute name is renamed in blueprint, then the blueprint is None in the entity.
        if node.blueprint is not None:
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

    # Creates a "storage correct" dict from a Node. Writing references as references, and contained docs in full.
    @staticmethod
    def to_ref_dict(node):
        data = {}

        try:
            data["_id"] = node.dto.uid
        except Exception as error:
            logger.error(error)
            logger.exception(error)
        # Primitive
        # if complex attribute name is renamed in blueprint, then the blueprint is None in the entity.
        if node.blueprint is not None:
            for attribute in node.blueprint.get_primitive_types():
                if attribute.name in node.dto.data:
                    data[attribute.name] = node.dto.data[attribute.name]

        # Complex
        for child in node.children:
            if child.is_array():
                # If the content of the list is not contained, i.e. references.
                if not child.attribute_is_contained():
                    data[child.key] = [
                        {"_id": child.uid, "type": child.type, "name": child.name} for child in child.children
                    ]
                else:
                    data[child.key] = [list_child.to_dict() for list_child in child.children]
            else:
                if child.not_contained():
                    data[child.key] = {"_id": child.uid, "type": child.type, "name": child.name}
                else:
                    data[child.key] = child.to_dict()
        return data


class DictImporter:
    @classmethod
    def from_dict(cls, dto, blueprint_provider):
        return cls._from_dict(dto, "root", blueprint_provider)

    @classmethod
    def _from_dict(cls, dto, key, blueprint_provider):
        try:
            node = Node(key=key, blueprint_provider=blueprint_provider, dto=dto)
        except KeyError as error:
            logger.exception(error)
            error_node = Node(key=dto.name, dto=DTO(data={"name": dto.name, "type": ""}))
            error_node.set_error("_blueprint is missing from dto")
            return error_node

        try:
            for attribute in node.blueprint.get_none_primitive_types():
                if attribute.is_array():
                    children = dto.data.get(attribute.name, [])
                    data = {
                        "name": attribute.name,
                        "type": attribute.attribute_type,
                        "attributeType": attribute.attribute_type,
                    }
                    list_node = ListNode(
                        key=attribute.name, dto=DTO(uid="", data=data), blueprint_provider=blueprint_provider
                    )
                    for i, child in enumerate(children):
                        list_child_node = cls._from_dict(
                            dto=DTO(uid=child.get("uid", ""), data=child),
                            key=str(i),
                            blueprint_provider=blueprint_provider,
                        )
                        list_node.add_child(list_child_node)
                        # todo implement error node handling.

                    node.add_child(list_node)
                else:
                    if attribute.name in dto.data:
                        attribute_data = dto.data.get(attribute.name)
                        if bool(attribute_data):
                            child_node = cls._from_dict(
                                dto=DTO(uid=attribute_data.get("uid", ""), data=attribute_data),
                                key=attribute.name,
                                blueprint_provider=blueprint_provider,
                            )
                            node.add_child(child_node)
                        else:
                            # TODO: This check stops the Tree from generating child nodes if they have no data in the entity.
                            # SOLUTION: dont add the node. Add context menu create item if its optional. #562
                            pass
                    else:
                        error_node = Node(
                            key=attribute.name,
                            dto=DTO(
                                data={
                                    "name": attribute.name,
                                    # avoid DtoException
                                    "type": "",
                                }
                            ),
                            blueprint_provider=blueprint_provider,
                        )
                        error_node.set_error(f"failed to add attribute node: {attribute.name}")
                        # #524 #543 the following line break several unit tests related to save and remove in the service.
                        # node.add_child(error_node)
                        logger.warning(f"Data problem: {attribute.name}")
            return node
        except AttributeError as error:
            logger.exception(error)
            return Node(key=dto.name, blueprint_provider=blueprint_provider)


def create_error_node(cls, attribute) -> Dict:
    return cls._from_dict(dto=DTO(uid="", data={"name": attribute.name}), key="")


class NodeBase:
    def __init__(self, key: str, dto: DTO = None, parent=None, children=None, blueprint_provider=None):
        if not blueprint_provider:
            raise Exception("missing provider")
        self.blueprint_provider = blueprint_provider
        if key is None:
            raise Exception("Node requires a key")

        self.key = key
        self.dto = dto
        self.has_error = False
        self.parent: Union[Node, ListNode] = parent
        if parent:
            parent.add_child(self)

        self.children = []
        if children is not None:
            for child in children:
                self.add_child(child)

    def has_uid(self):
        return self.dto.uid != ""

    @property
    def uid(self):
        return self.dto.uid

    @property
    def parent_node_id(self):
        if not self.parent:
            return None

        return self.parent.node_id

    def is_contained(self):
        return self.uid == ""

    def not_contained(self):
        return not self.uid == ""

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

    # Replace the entire data of the node with the input dict. If it matches the blueprint...
    def update(self, data: Union[Dict, List]):
        if isinstance(data, dict):
            data.pop("_id", None)
            # TODO: "uid" should never be on the data dict
            data.pop("uid", None)
            # Modify and add for each key in posted data
            for key in data.keys():
                new_data = data[key]
                attribute = self.blueprint.get_attribute_by_key(key)
                if not attribute:
                    logger.error(f"Could not find attribute {key} in {self.dto.uid}")
                    continue

                # Add/Modify primitive data
                if attribute.is_primitive():
                    self.dto.data[key] = new_data
                # Add/Modify complex data
                else:
                    for index, child in enumerate(self.children):
                        if child.key == key:
                            # This means we are creating a new, non-contained document. Lists are always contained.
                            if not child.attribute_is_contained() and child.uid == "" and not child.is_array():
                                new_node = Node(
                                    key=key,
                                    dto=DTO(new_data, uid=str(uuid4())),
                                    blueprint_provider=self.blueprint_provider,
                                )
                                self.children[index] = new_node
                            else:
                                child.update(new_data)

            # Remove for every key in blueprint not in data
            removed_attributes = [attr for attr in self.blueprint.attributes if attr.name not in data]
            for attribute in removed_attributes:
                # Pop primitive data
                if attribute.is_primitive():
                    self.dto.data.pop(attribute.name, None)
                # Remove complex data
                else:
                    self.remove_by_path([attribute.name])

        # If it's a ListNode, delete all content, and append for each in posted data
        else:
            self.children = []
            for i, item in enumerate(data):
                # Set uid base on containment and existing(lack of) uid
                # This require the existing _id to be posted
                uid = "" if self.attribute_is_contained() else item.get("_id", str(uuid4()))
                new_node = Node(key=str(i), dto=DTO(item, uid=uid), blueprint_provider=self.blueprint_provider)
                self.children.append(new_node)

    def has_children(self):
        return len(self.children) > 0

    def remove_by_path(self, keys: List) -> None:
        if len(keys) == 1:
            for index, child in enumerate(self.children):
                if child.key == keys[0]:
                    self.children.pop(index)
                    return
            return
        next_node = next((x for x in self.children if x.key == keys[0]), None)
        if not next_node:
            return
        keys.pop(0)
        next_node.remove_by_path(keys)

    def remove_by_node_id(self, node_id) -> None:
        for i, c in enumerate(self.children):
            if c.node_id == node_id:
                self.children.pop(i)

    def has_error(self):
        return self.error is not None


class Node(NodeBase):
    def __init__(self, key: str, dto: DTO = None, blueprint_provider=None, parent=None):
        super().__init__(key=key, dto=dto, blueprint_provider=blueprint_provider, parent=parent)
        try:
            self.blueprint = blueprint_provider.get_blueprint(dto["type"])
        except:
            print("error")
        self.error_message = None

    def attribute_is_contained(self):
        return self.parent.blueprint.storage_recipes[0].is_contained(self.key)

    def to_dict(self):
        return DictExporter.to_dict(self)

    def to_ref_dict(self):
        return DictExporter.to_ref_dict(self)

    @staticmethod
    def from_dict(dto: DTO, blueprint_provider):
        return DictImporter.from_dict(dto, blueprint_provider)

    def remove(self):
        self.parent.remove_by_node_id(self.node_id)

    def set_error(self, error_message: str):
        self.has_error = True
        self.error_message = error_message


class ListNode(NodeBase):
    def __init__(self, key: str, dto: DTO, parent=None, blueprint_provider=None):
        super().__init__(key=key, dto=dto, parent=parent, blueprint_provider=blueprint_provider)

    def attribute_is_contained(self):
        return self.blueprint.storage_recipes[0].is_contained(self.key)

    @property
    def blueprint(self):
        return self.parent.blueprint

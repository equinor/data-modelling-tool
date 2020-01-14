from copy import deepcopy
from typing import Dict, List, Union

from classes.blueprint import Blueprint
from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO


class NodeBase:
    def __init__(self, node_id: str, parent=None, depth: int = 0):
        self.parent: Union[Node, ListNode] = parent
        self.node_id: str = node_id
        self.children = []
        self.depth = depth + 1


class Node(NodeBase):
    # Consumes a DTO with complete resolved references
    # Everything is treated as an Entity, there is no special logic for Blueprints
    # The result is a double linked tree data structure
    def __init__(self, dto: DTO, parent=None, depth: int = 0):
        super().__init__(node_id=dto.uid, parent=parent, depth=depth)
        self.name: str = dto.name
        self.type = dto.type
        # blueprint: Blueprint = get_blueprint(dto.type)
        self.blueprint: Blueprint = Blueprint.from_dict(dto["_blueprint"])
        # TODO: Might want to avoid this deepcopy of the dto. Could be expensive with big entities
        # Primitive data are added to the nodes .data, rest is a dict
        self.dto, complex_types = self.separate_complex_types_from_dto(deepcopy(dto), self.blueprint)
        # Every complex type attribute get's its own node
        for key, value in complex_types.items():
            # If the attribute is a list, we create a list-node that has no data, but has children
            if isinstance(value, list):
                list_type = self.blueprint.type_of_attribute_name(key)
                self.children.append(
                    ListNode(
                        data_list=value,
                        name=key,
                        node_id=f"{self.node_id}.{key}",
                        parent=self,
                        depth=self.depth,
                        type=list_type,
                    )
                )
            else:
                if value:
                    # If the element has it's own "_id", use that. Else we create a "dotted-id" by key.
                    uid = value.get("uid", f"{self.node_id}.{key}")
                    self.children.append(Node(dto=DTO(uid=uid, data=value), parent=self, depth=self.depth,))

    @staticmethod
    def separate_complex_types_from_dto(dto: DTO, blueprint: Blueprint) -> (DTO, Dict):
        complex_attribute_types: List[BlueprintAttribute] = blueprint.get_none_primitive_types()
        # This 'none' allows entitites which lack a attribute given in its blueprint
        complex_types = {}
        for attr in complex_attribute_types:
            complex_types.update({attr.name: dto.data.pop(attr.name, None)})
        return dto, complex_types


class ListNode(NodeBase):
    def __init__(self, data_list: List, name: str, node_id: str, type: str, parent=None, depth: int = 0):
        super().__init__(node_id=node_id, parent=parent, depth=depth)
        self.name = name
        self.type = type
        # No need to remove primitive types here, as primitive types does not get it's own node.
        # So every element in the input list is a complex type.
        for i, element in enumerate(data_list):
            # We have no case with a list within a list yet...
            if isinstance(element, List):
                self.children.append(
                    ListNode(
                        data_list=element,
                        name=str(i),
                        node_id=f"{self.node_id}.{str(i)}",
                        parent=self,
                        depth=self.depth,
                        type="List",
                    )
                )
            else:
                node_id = element.get("uid", f"{self.node_id}.{str(i)}")
                self.children.append(Node(dto=DTO(uid=node_id, data=element), parent=self, depth=self.depth))

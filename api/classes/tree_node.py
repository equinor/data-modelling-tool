from copy import deepcopy
from typing import List, Union, Dict

from classes.blueprint import Blueprint
from classes.blueprint_attribute import BlueprintAttribute
from classes.dto import DTO
from core.utility import get_blueprint


class NodeBase:
    def __init__(self, uid: str, parent=None, depth: int = 0):
        self.parent: Union[Node, ListNode] = parent
        self.uid: str = uid
        self.children = []
        self.depth = depth + 1


class Node(NodeBase):
    # Consumes a DTO with complete resolved references
    # Everything is treated as an Entity, there is no special logic for Blueprints
    # The result is a double linked tree data structure
    def __init__(self, dto: DTO, parent=None, depth: int = 0):
        super().__init__(uid=dto.uid, parent=parent, depth=depth)

        self.name: str = dto.name
        self.type = dto.type
        # TODO: Consider appending blueprint to dto from Repo Service.
        # TODO: this will remove the need to fetch the blueprint 2 times
        blueprint: Blueprint = get_blueprint(self.type)
        # TODO: Might want to avoid this deepcopy of the dto. Could be expensive with big entities
        # Primitive data are added to the nodes .data, rest is a dict
        self.dto, complex_types = self.separate_complex_types_from_dto(deepcopy(dto), blueprint)
        # Every complex type attribute get's its own node
        for key, value in complex_types.items():
            # If the attribute is a list, we create a list-node that has no data, but has children
            if isinstance(value, list):
                self.children.append(
                    ListNode(data_list=value, name=key, uid=f"{self.uid}.{key}", parent=self, depth=self.depth)
                )
            else:
                if value:
                    # If the element has it's own "_id", use that. Else we create a "dotted-id" by key.
                    uid = value.get("uid", f"{self.uid}.{key}")
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
    def __init__(self, data_list: List, name: str, uid: str, parent=None, depth: int = 0):
        super().__init__(uid=uid, parent=parent, depth=depth)
        self.name = name
        # No need to remove primitive types here, as primitive types does not get it's own node.
        # So every element in the input list is a complex type.
        for i, element in enumerate(data_list):
            if isinstance(element, List):
                self.children.append(
                    ListNode(data_list=element, name=str(i), uid=f"{self.uid}.{str(i)}", parent=self, depth=self.depth)
                )
            else:
                uid = element.get("uid", f"{self.uid}.{element.get('name', 'name missing')}")
                self.children.append(Node(dto=DTO(uid=uid, data=element), parent=self, depth=self.depth))

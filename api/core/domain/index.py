from __future__ import annotations

from anytree import NodeMixin

from core.domain.blueprint import Blueprint
from core.domain.dto import DTO


class DocumentNode(NodeMixin):
    def __init__(
        self,
        data_source_id: str,
        name: str,
        menu_items,
        on_select=None,
        document: DTO = None,
        blueprint: Blueprint = None,
        parent: DocumentNode = None,
    ):
        self.data_source_id = data_source_id
        self.name = name
        self.document = document
        self.blueprint = blueprint
        self.parent = parent
        if not menu_items:
            menu_items = []
        if not on_select:
            on_select = None
        self.on_select = on_select
        self.menu_items = menu_items

    @property
    def uid(self):
        if self.document:
            return self.document.uid

    @property
    def start_path(self):
        return "/".join([node.name for node in self.path])

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

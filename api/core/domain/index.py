from __future__ import annotations

from anytree import NodeMixin

from core.domain.models import Blueprint
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
        is_contained=None,
        is_root_package=False,
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
        if not is_contained:
            is_contained = False
        self.is_contained = is_contained
        self.is_root_package = is_root_package

    @property
    def uid(self):
        if self.document:
            return self.document.uid

    @property
    def start_path(self):
        return "/".join([node.name for node in self.path])

    @property
    def id(self):
        if self.is_contained:
            return f"{self.document.uid}_{self.name}"
        elif self.document:
            return f"{self.document.uid}"
        elif self.depth == 0:
            return self.data_source_id
        else:
            raise Exception

    @property
    def parent_id(self):
        # If node is data source
        if not self.parent:
            return None
        # If parent is data source
        elif self.parent and not self.parent.document:
            return None
        else:
            return self.parent.id

    def to_node(self):
        result = {
            "parentId": self.parent_id,
            "filename": self.name,
            "title": self.name,
            "id": self.id,
            "nodeType": "document-node",
            "children": [child.id for child in self.children],
            "type": "datasource" if not self.document else self.document.type,
            "isRootPackage": self.is_root_package,
            "meta": {"menuItems": self.menu_items, "onSelect": self.on_select},
        }
        return result

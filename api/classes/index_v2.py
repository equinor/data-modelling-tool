from __future__ import annotations

from anytree import NodeMixin

from classes.blueprint import Blueprint
from classes.dto import DTO
from core.use_case.utils.sort_menu_items import sort_menu_items


class DocumentNode(NodeMixin):
    def __init__(
        self,
        uid: str,
        type: str,
        data_source_id: str,
        name: str,
        menu_items,
        on_select=None,
        error=False,
        document: DTO = None,
        blueprint: Blueprint = None,
        parent: DocumentNode = None,
        is_contained=None,
        is_root_package=False,
        is_list=False,
    ):
        self.uid = uid
        self.type = type
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
        self.error = error
        self.menu_items = menu_items
        if not is_contained:
            is_contained = False
        self.is_contained = is_contained
        self.is_root_package = is_root_package
        self.is_list = is_list

    @property
    def parent_id(self):
        # If node is data source
        if not self.parent:
            return None
        else:
            return self.parent.uid

    def to_node(self):
        result = {
            "parentId": self.parent_id,
            "filename": self.name,
            "title": self.name,
            "id": self.uid,
            "nodeType": "document-node",
            "children": [child.uid for child in self.children],
            "type": self.type,
            "meta": {
                "menuItems": self.menu_items,
                "onSelect": self.on_select,
                "error": self.error,
                "isRootPackage": self.is_root_package,
                "isList": self.is_list,
            },
        }
        return result

    def sort_menu_items(self):
        self.menu_items = sort_menu_items(self.menu_items)

from typing import Callable, List, Union
from uuid import UUID, uuid4

from enums import SIMOS


class Package:
    def __init__(self, name: str, description: str = "", uid: UUID = None, is_root: bool = False):
        self.name = name
        self.description = description
        self.uid = uid if uid else uuid4()
        self.is_root = is_root
        self.content: List[Union[Package, dict]] = []

    def __str__(self):
        return f"Name: {self.name}, Content: {len(self.content)}"

    def __getitem__(self, item):
        return self.__getattribute__(item)

    def search(self, filename: str) -> Union["Package", dict]:
        return next((child for child in self.content if child["name"] == filename), None)

    def to_dict(self):
        return {
            "_id": str(self.uid),
            "type": self.type,
            "name": self.name,
            "description": self.description,
            "isRoot": self.is_root,
            "content": self._content_to_ref_dict(),
        }

    def traverse_documents(self, func: Callable, update: bool = False, **kwargs) -> None:
        """
        Traverses the Package structure, calling the passed function on every non-Package node
        @param func: A function that takes the document node as it's first parameter
        @param update: Whether or not to set the tree node to be the return value from the passed function
        @param kwargs: Keyword arguments to be passed to 'func'
        """
        for i, child in enumerate(self.content):
            if isinstance(child, Package):
                child.traverse_documents(func, update=update, **kwargs)
            else:
                if update:
                    self.content[i] = func(child, **kwargs)
                else:
                    func(child, **kwargs)

    def traverse_package(self, func: Callable, update: bool = False, **kwargs) -> None:
        """
        Traverses the Package structure, calling the passed function on every Package node
        @param func: A function that takes the Package node as it's first parameter
        @param update: Whether or not to set the tree node to be the return value from the passed function
        @param kwargs: Keyword arguments to be passed to 'func'
        """
        for i, child in enumerate(self.content):
            if isinstance(child, Package):
                if update:
                    self.content[i] = func(child, **kwargs)
                else:
                    func(child, **kwargs)
                child.traverse_package(func, update, **kwargs)

    @property
    def type(self):
        return SIMOS.PACKAGE.value

    def _content_to_ref_dict(self):
        result = []
        for child in self.content:
            if isinstance(child, Package):
                result.append(
                    {"_id": str(child.uid), "name": child.name, "type": SIMOS.PACKAGE.value, "contained": True}
                )
            else:  # Assume the child is a dict
                if "name" in child:
                    result.append(
                        {"_id": child["_id"], "name": child["name"], "type": child["type"], "contained": True}
                    )

                else:
                    result.append({"_id": child["_id"], "type": child["type"], "contained": True})
        return result

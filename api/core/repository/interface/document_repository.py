from abc import ABC, abstractmethod
from typing import List

from core.domain.document import Document


class DocumentRepository(ABC):
    @abstractmethod
    def get(self, uid: str) -> Document:
        """Get method to be implemented"""

    @abstractmethod
    def update(self, document: Document) -> None:
        """Update method to be implemented"""

    @abstractmethod
    def add(self, document: Document) -> None:
        """Add method to be implemented"""

    @abstractmethod
    def delete(self, document: Document) -> None:
        """Delete method to be implemented"""

    @abstractmethod
    def get_nodes(self, path: str, direct_descendants_only: bool = True) -> List[Document]:
        """Get nodes method to be implemented"""

    @abstractmethod
    def get_by_path_and_filename(self, path: str, filename: str) -> Document:
        """Get by path and filename method to be implemented"""

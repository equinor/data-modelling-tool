from abc import ABC, abstractmethod
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

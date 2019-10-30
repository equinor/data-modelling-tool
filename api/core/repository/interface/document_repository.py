from abc import ABC, abstractmethod

from core.domain.dto import DTO


class DocumentRepository(ABC):
    @abstractmethod
    def get(self, uid: str) -> DTO:
        """Get method to be implemented"""

    @abstractmethod
    def update(self, document: DTO) -> None:
        """Update method to be implemented"""

    @abstractmethod
    def add(self, document: DTO) -> None:
        """Add method to be implemented"""

    @abstractmethod
    def delete(self, document: DTO) -> None:
        """Delete method to be implemented"""

    @abstractmethod
    def find(self, filter: dict) -> DTO:
        """Find method to be implemented"""

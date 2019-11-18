from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Optional

from core.domain.dto import DTO


T = TypeVar("T")


class DocumentRepository(ABC, Generic[T]):
    @abstractmethod
    def get(self, uid: str) -> DTO[T]:
        """Get method to be implemented"""

    @abstractmethod
    def update(self, document: DTO[T]) -> None:
        """Update method to be implemented"""

    @abstractmethod
    def add(self, document: DTO[T]) -> None:
        """Add method to be implemented"""

    @abstractmethod
    def delete(self, document: DTO[T]) -> None:
        """Delete method to be implemented"""

    @abstractmethod
    def find(self, filter: dict, single: bool = None, raw: bool = None) -> Optional[DTO[T]]:
        """Find method to be implemented"""

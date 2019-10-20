from abc import ABC, abstractmethod
from typing import Dict

from core.domain.dto import DTO


class DocumentRepository(ABC):
    @abstractmethod
    def get(self, uid: str) -> DTO:
        """Get method to be implemented"""

    @abstractmethod
    def update(self, uid: str, data: Dict) -> None:  # self, document: DTO
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

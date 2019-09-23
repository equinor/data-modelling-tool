from abc import ABC, abstractmethod
from core.domain.root_package import RootPackage
from typing import List


class RootPackageRepository(ABC):
    @abstractmethod
    def list(self) -> List[RootPackage]:
        """List method to be implemented"""

    @abstractmethod
    def add(self, root_package: RootPackage) -> RootPackage:
        """Add method to be implemented"""

    @abstractmethod
    def update(self, root_package: RootPackage) -> None:
        """Update method to be implemented"""

    @abstractmethod
    def delete(self, root_package: RootPackage) -> None:
        """Delete method to be implemented"""

    @abstractmethod
    def get(self, uid: str) -> RootPackage:
        """Add method to be implemented"""

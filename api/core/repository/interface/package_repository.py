from abc import ABC, abstractmethod
from core.domain.package import Package
from typing import List


class PackageRepository(ABC):
    @abstractmethod
    def list(self) -> List[Package]:
        """List method to be implemented"""

    @abstractmethod
    def add(self, root_package: Package) -> Package:
        """Add method to be implemented"""

    @abstractmethod
    def update(self, root_package: Package) -> None:
        """Update method to be implemented"""

    @abstractmethod
    def delete(self, root_package: Package) -> None:
        """Delete method to be implemented"""

    @abstractmethod
    def get(self, uid: str) -> Package:
        """Add method to be implemented"""

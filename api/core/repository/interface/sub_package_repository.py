from abc import ABC, abstractmethod
from core.domain.sub_package import SubPackage


class SubPackageRepository(ABC):
    @abstractmethod
    def get(self, uid: str) -> SubPackage:
        """Get method to be implemented"""

    @abstractmethod
    def update(self, sub_package: SubPackage) -> None:
        """Update method to be implemented"""

    @abstractmethod
    def add(self, sub_package: SubPackage) -> None:
        """Add method to be implemented"""

    @abstractmethod
    def delete(self, sub_package: SubPackage) -> None:
        """Delete method to be implemented"""

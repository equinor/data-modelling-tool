from abc import ABC, abstractmethod
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from core.repository.repository_exceptions import EntityAlreadyExistsException
from typing import Dict, List, Optional


class DbClient(ABC):
    @abstractmethod
    def add(self, uid: str, document: Dict) -> bool:
        """Get method to be implemented"""

    @abstractmethod
    def update(self, uid: str, document: Dict) -> bool:
        """Update method to be implemented"""

    @abstractmethod
    def get(self, uid: str) -> Dict:
        """Get method to be implemented"""

    @abstractmethod
    def delete(self, uid: str) -> bool:
        """Delete method to be implemented"""

    @abstractmethod
    def find(self, filters: Dict) -> Optional[List[Dict]]:
        """Find method to be implemented"""

    @abstractmethod
    def find_one(self, filters: Dict) -> Dict:
        """Find one method to be implemented"""


class MongoDbClient(DbClient):
    def __init__(
        self, host: str, username: str, password: str, database: str, tls: bool, collection: str, port: int = 27001
    ):
        self.handler = MongoClient(
            host=host,
            port=port,
            username=username,
            password=password,
            tls=tls,
            connectTimeoutMS=5000,
            serverSelectionTimeoutMS=5000,
        )[database]
        self.collection = collection

    def add(self, uid: str, document: Dict) -> bool:
        document["_id"] = uid
        try:
            return self.handler[self.collection].insert_one(document).acknowledged
        except DuplicateKeyError:
            raise EntityAlreadyExistsException(document["id"])

    def update(self, uid: str, document: Dict) -> bool:
        try:
            return self.handler[self.collection].update_one({"_id": uid}, {"$set": document}, upsert=True).acknowledged
        except Exception as error:
            print("ERROR", error)
            return False

    def get(self, uid: str) -> Dict:
        result = self.handler[self.collection].find_one(filter={"_id": uid})
        if result:
            result["uid"] = uid
        return result

    def delete(self, uid: str) -> bool:
        return self.handler[self.collection].delete_one(filter={"_id": uid}).acknowledged

    def find(self, filters: Dict) -> Optional[List[Dict]]:
        return self.handler[self.collection].find(filter=filters)

    def find_one(self, filters: Dict) -> Optional[Dict]:
        return self.handler[self.collection].find_one(filter=filters)

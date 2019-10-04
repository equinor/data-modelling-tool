from typing import Dict

from core.domain import DocumentDto
from core.repository.mongo.mongo_repository_base import MongoRepositoryBase


class DocumentDtoRepository(MongoRepositoryBase):
    class Meta:
        data = Dict

    def __init__(self, db):
        super().__init__(db)

    def get(self, uid: str) -> DocumentDto:
        result = self.c().get(uid)
        uid: str = result["uid"]
        data = result
        del data["uid"]
        del data["_id"]
        return {"uid": uid, "data": result}

    def update(self, uid: str, data: Dict) -> None:
        # flatten dto, keep back compability
        data["_id"] = uid
        data["uid"] = uid
        self.c().update(uid, data)

    def add(self, dto: DocumentDto) -> None:
        self.c().add(dto.data.to_dict())

    def delete(self, document: DocumentDto) -> None:
        self.c().delete(document.uid)

    def list(self):
        return [DocumentDto.from_dict(document) for document in self.c().find(filters={})]

    # def get_by_path_and_filename(self, path: str, filename: str) -> DocumentDto:
    #     filters = {"path": path, "filename": filename}
    #     adict = self.c().find_one(filters=filters)
    #     if adict:
    #         return Document.from_dict(adict)
    #
    # def get_nodes(self, path: str, direct_descendants_only: bool = True) -> List[Document]:
    #     direct_descendants = "$" if direct_descendants_only else ""
    #     match_criteria = f"^{path}{direct_descendants}"
    #     filters = {"path": {"$regex": match_criteria}}
    #     result = []
    #     for item in self.c().find(filters=filters):
    #         result.append(Document.from_dict(item))
    #     return result

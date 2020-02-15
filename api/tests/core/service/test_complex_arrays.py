import unittest
from unittest import mock

from classes.blueprint import Blueprint
from classes.dto import DTO
from core.repository import Repository
from core.service.document_service import DocumentService
from utils.data_structure.compare import pretty_eq

package_blueprint = {
    "type": "system/SIMOS/Blueprint",
    "name": "Package",
    "description": "This is a blueprint for a package that contains documents and other packages",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {
            "attributeType": "string",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "description",
            "default": "",
            "optional": True,
        },
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "boolean", "type": "system/SIMOS/BlueprintAttribute", "name": "isRoot"},
        {
            "attributeType": "system/DMT/Entity",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "content",
            "dimensions": "*",
            "optional": True,
        },
    ],
}

higher_rank_array_blueprint = {
    "type": "system/SIMOS/Blueprint",
    "name": "Higher rank integer arrays",
    "description": "First blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
        {
            "attributeType": "integer",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "1_dim-unfixed",
            "dimensions": "*",
        },
        {
            "attributeType": "integer",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "1_dim-fixed",
            "dimensions": "5",
        },
        {
            "attributeType": "integer",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "2_dim-unfixed",
            "dimensions": "*,*",
        },
        {
            "attributeType": "integer",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "3_dim-mix",
            "dimensions": "*,1,100",
        },
    ],
}


def get_blueprint(type: str):
    if type == "higher_rank_array":
        return Blueprint(DTO(higher_rank_array_blueprint))
    elif type == "package_blueprint":
        return Blueprint(DTO(package_blueprint))

    return None


class ArraysDocumentServiceTestCase(unittest.TestCase):
    @staticmethod
    # TODO: Refactor on Blueprint change in DOcService
    def test_create_complex_array():
        doc_storage = {
            "1": {
                "uid": "1",
                "name": "Package",
                "description": "My package",
                "type": "package_blueprint",
                "content": [],
            }
        }

        def mock_get(document_id: str):
            return DTO(doc_storage[document_id])

        def mock_update(dto: DTO):
            doc_storage[dto.uid] = dto.data

        document_repository: Repository = mock.Mock()
        document_repository.get = mock_get
        document_repository.update = mock_update

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return document_repository

        document_service = DocumentService(repository_provider=repository_provider, blueprint_provider=get_blueprint)
        document_service.add_document(
            data_source_id="testing",
            parent_id="1",
            type="higher_rank_array",
            name="complexArraysEntity",
            description="",
            attribute_path="content",
        )

        actual_1 = {"_id": "1", "content": {"_id": "2", "name": "complexArraysEntity", "type": "higher_rank_array"}}
        # Disable Black formatting for the matrix
        # fmt: off
        actual_2 = {
            "_id": "2",
            "name": "complexArraysEntity",
            "type": "higher_rank_array",
            "1_dim-unfixed": [],
            "1_dim-fixed": [0, 0, 0, 0, 0],
            "2_dim-unfixed": [[], []],
            "3_dim-mix": [
                [
                    [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                    ]
                ],
            ],
        }
        # fmt: on

        assert pretty_eq(actual_1, doc_storage["1"]) is None
        assert pretty_eq(actual_2, doc_storage["2"]) is None

    @staticmethod
    def test_update_complex_array():

        # fmt: off
        doc_storage = {
            "1": {
                "_id": "1",
                "uid": "1",
                "name": "complexArraysEntity",
                "type": "higher_rank_array",
                "1_dim-unfixed": [],
                "1_dim-fixed": [0, 0, 0, 0, 0],
                "2_dim-unfixed": [[], []],
                "3_dim-mix": [
                    [
                        [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                        ]
                    ],
                ],
            }
        }

        # fmt: on

        def mock_get(document_id: str):
            return DTO(doc_storage[document_id])

        def mock_update(dto: DTO):
            doc_storage[dto.uid] = dto.data

        document_repository: Repository = mock.Mock()
        document_repository.get = mock_get
        document_repository.update = mock_update

        def repository_provider(data_source_id):
            if data_source_id == "testing":
                return document_repository

        document_service = DocumentService(repository_provider=repository_provider, blueprint_provider=get_blueprint)
        # fmt: off
        document_service.update_document(
            data_source_id="testing",
            document_id="1",
            data={
                "_id": "1",
                "name": "complexArraysEntity",
                "type": "higher_rank_array",
                "1_dim-unfixed": [45, 65, 999999999999999999, 0, -12],
                "1_dim-fixed": [0, 0, 3, 326345, -91237],
                "2_dim-unfixed": [[23, 234, 123], [1, 1, 1, 1, 1, 1]],
                "3_dim-mix": [
                    [
                        [
                            11, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 22
                        ]
                    ],
                    [
                        [
                            33, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 44
                        ]
                    ],
                ],
            },
        )

        actual_1 = {
            "_id": "1",
            "name": "complexArraysEntity",
            "type": "higher_rank_array",
            "1_dim-unfixed": [45, 65, 999999999999999999, 0, -12],
            "1_dim-fixed": [0, 0, 3, 326345, -91237],
            "2_dim-unfixed": [[23, 234, 123], [1, 1, 1, 1, 1, 1]],
            "3_dim-mix": [
                [
                    [
                        11, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 22
                    ]
                ],
                [
                    [
                        33, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 44
                    ]
                ],
            ],
        }
        # fmt: on
        assert actual_1 == doc_storage["1"]

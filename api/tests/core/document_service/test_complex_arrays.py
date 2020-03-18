import unittest
from unittest import mock

from classes.blueprint import Blueprint
from classes.dto import DTO
from core.repository import Repository
from core.repository.file import TemplateRepositoryFromFile
from core.service.document_service import DocumentService
from utils.data_structure.compare import pretty_eq
from utils.helper_functions import schemas_location

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
    "storageRecipes": [
        {
            "type": "system/SIMOS/StorageRecipe",
            "name": "DefaultStorageRecipe",
            "description": "",
            "attributes": [{"name": "content", "type": "system/DMT/Entity", "contained": False}],
        }
    ],
}

basic_blueprint = {
    "type": "system/SIMOS/Blueprint",
    "name": "A box",
    "description": "First blueprint",
    "attributes": [
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "name"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "type"},
        {"attributeType": "string", "type": "system/SIMOS/BlueprintAttribute", "name": "description"},
        {"attributeType": "integer", "type": "system/SIMOS/BlueprintAttribute", "name": "length"},
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
            "attributeType": "basic_blueprint",
            "type": "system/SIMOS/BlueprintAttribute",
            "name": "1_dim-fixed_complex_type",
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

file_repository_test = TemplateRepositoryFromFile(schemas_location())


class BlueprintProvider:
    def get_blueprint(self, template_type: str):
        if template_type == "higher_rank_array":
            return Blueprint(DTO(higher_rank_array_blueprint))
        elif template_type == "package_blueprint":
            return Blueprint(DTO(package_blueprint))
        elif template_type == "basic_blueprint":
            return Blueprint(DTO(basic_blueprint))
        else:
            return Blueprint(DTO(file_repository_test.get(template_type)))


blueprint_provider = BlueprintProvider()


class ArraysDocumentServiceTestCase(unittest.TestCase):
    def test_create_complex_array(self):
        doc_storage = {
            "1": {
                "_id": "1",
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

        document_service = DocumentService(
            repository_provider=repository_provider, blueprint_provider=blueprint_provider
        )
        document_service.add_document(
            data_source_id="testing",
            parent_id="1",
            type="higher_rank_array",
            name="complexArraysEntity",
            description="",
            attribute_path="content",
        )

        actual_1 = {"_id": "1", "content": [{"name": "complexArraysEntity", "type": "higher_rank_array"}]}
        # Disable Black formatting for the matrix
        # fmt: off
        actual_2 = {
            "name": "complexArraysEntity",
            "type": "higher_rank_array",
            "1_dim-unfixed": [],
            "1_dim-fixed_complex_type": [
                {
                 "name": "0",
                 "type": "basic_blueprint",
                 "description": "",
                 "length": 0
                },
                {
                    "name": "1",
                    "type": "basic_blueprint",
                    "description": "",
                    "length": 0
                },
                {
                    "name": "2",
                    "type": "basic_blueprint",
                    "description": "",
                    "length": 0
                },
                {
                    "name": "3",
                    "type": "basic_blueprint",
                    "description": "",
                    "length": 0
                },
                {
                    "name": "4",
                    "type": "basic_blueprint",
                    "description": "",
                    "length": 0
                },
            ],
            "2_dim-unfixed": [[]],
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
        assert pretty_eq(actual_2, doc_storage[list(doc_storage)[1]]) is None

    def test_update_complex_array(self):

        # fmt: off
        doc_storage = {
            "1": {
                "_id": "1",
                "name": "complexArraysEntity",
                "type": "higher_rank_array",
                "1_dim-unfixed": [],
                "1_dim-fixed_complex_type": [
                    {
                        "name": "0",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 0
                    },
                    {
                        "name": "1",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 0
                    },
                    {
                        "name": "2",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 0
                    },
                    {
                        "name": "3",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 0
                    },
                    {
                        "name": "4",
                        "type": "basic_blueprint",
                        "description": "some description",
                        "length": 0
                    },
                ],
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

        document_service = DocumentService(
            repository_provider=repository_provider, blueprint_provider=blueprint_provider
        )
        # fmt: off
        document_service.update_document(
            data_source_id="testing",
            document_id="1",
            data={
                "_id": "1",
                "name": "complexArraysEntity",
                "type": "higher_rank_array",
                "1_dim-unfixed": [45, 65, 999999999999999999, 0, -12],
                "1_dim-fixed_complex_type": [
                    {
                        "name": "0",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 1
                    },
                    {
                        "name": "1",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 23
                    },
                    {
                        "name": "2",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 200
                    },
                    {
                        "name": "3",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 345
                    },
                    {
                        "name": "4",
                        "type": "basic_blueprint",
                        "description": "some other description",
                        "length": 1
                    },
                ],
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
            "1_dim-fixed_complex_type": [
                    {
                        "name": "0",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 1
                    },
                    {
                        "name": "1",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 23
                    },
                    {
                        "name": "2",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 200
                    },
                    {
                        "name": "3",
                        "type": "basic_blueprint",
                        "description": "",
                        "length": 345
                    },
                    {
                        "name": "4",
                        "type": "basic_blueprint",
                        "description": "some other description",
                        "length": 1
                    },
                ],
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

import io
import json
import unittest
from uuid import UUID
from zipfile import ZipFile

from use_case.import_package import package_tree_from_zip

"""
ROOT
 |
 |- WindTurbine.json
 |- myTurbine.json
 |- Moorings
    |- Mooring.json
    |- SpecialMooring.json
    |- myTurbineMooring.json
|- A
    |- SubFolder
         |- myTurbine2.json
|- B
    |- myTurbine3.json
"""

test_documents = {
    "MyRootPackage/WindTurbine": {
        "name": "WindTurbine",
        "type": "system/SIMOS/Blueprint",
        "extends": ["system/SIMOS/DefaultUiRecipes", "system/SIMOS/NamedEntity"],
        "description": "",
        "attributes": [
            {
                "name": "Mooring",
                "type": "system/SIMOS/BlueprintAttribute",
                "attributeType": "/Moorings/Mooring",
                "optional": True,
                "contained": False,
            }
        ],
    },
    "MyRootPackage/Moorings/Mooring": {
        "name": "Mooring",
        "type": "system/SIMOS/Blueprint",
        "extends": ["system/SIMOS/DefaultUiRecipes", "system/SIMOS/NamedEntity"],
        "description": "",
        "attributes": [
            {
                "name": "Bigness",
                "type": "system/SIMOS/BlueprintAttribute",
                "description": "How big? Very",
                "attributeType": "integer",
            }
        ],
    },
    "MyRootPackage/Moorings/SpecialMooring": {
        "name": "SpecialMooring",
        "type": "system/SIMOS/Blueprint",
        "extends": ["system/SIMOS/DefaultUiRecipes", "/Moorings/Mooring"],
        "description": "",
        "attributes": [
            {
                "name": "Smallness",
                "type": "system/SIMOS/BlueprintAttribute",
                "description": "How small? Not that small really",
                "attributeType": "integer",
            }
        ],
    },
    "MyRootPackage/myTurbine": {
        "name": "myTurbine",
        "type": "/WindTurbine",
        "description": "This is a wind turbine demoing uncontained relationships",
        "Mooring": {"_id": "apekatt", "type": "/Moorings/Mooring", "name": "myTurbineMooring"},
    },
    "MyRootPackage/Moorings/myTurbineMooring": {
        "_id": "apekatt",
        "name": "myTurbineMooring",
        "type": "/Moorings/Mooring",
        "description": "",
        "Bigness": 10,
    },
    "MyRootPackage/A/SubFolder/myTurbine2": {
        "name": "myTurbine2",
        "type": "/WindTurbine",
        "description": "This is a wind turbine demoing uncontained relationships",
        "Mooring": {"_id": "apekatt", "type": "/Moorings/Mooring", "name": "myTurbineMooring"},
    },
    "MyRootPackage/B/myTurbine3": {
        "name": "myTurbine3",
        "type": "/WindTurbine",
        "description": "This is a wind turbine demoing uncontained relationships",
        "Mooring": {"_id": "apekatt", "type": "/Moorings/Mooring", "name": "myTurbineMooring"},
    },
}


class ImportPackageTest(unittest.TestCase):
    def test_package_tree_from_zip_with_relative_references(self):
        memory_file = io.BytesIO()
        with ZipFile(memory_file, mode="w") as zip_file:
            for path, document in test_documents.items():
                zip_file.writestr(f"{path}.json", json.dumps(document).encode())

        memory_file.seek(0)

        root_package = package_tree_from_zip(
            data_source_id="test_data_source", package_name="MyRootPackage", zip_package=memory_file
        )
        folder_A = root_package.search("A")
        folder_Moorings = root_package.search("Moorings")
        myTurbineMooring = folder_Moorings.search("myTurbineMooring")
        folder_SubFolder = folder_A.search("SubFolder")
        myTurbine2 = folder_SubFolder.search("myTurbine2")

        assert myTurbine2["type"] == "test_data_source/MyRootPackage/WindTurbine"
        assert isinstance(UUID(myTurbine2["Mooring"]["_id"]), UUID)
        assert myTurbine2["Mooring"]["type"] == "test_data_source/MyRootPackage/Moorings/Mooring"
        assert myTurbine2["Mooring"]["_id"] == myTurbineMooring["_id"]

        windTurbine = root_package.search("WindTurbine")
        assert isinstance(UUID(windTurbine["_id"]), UUID)
        assert windTurbine["attributes"][0]["attributeType"] == "test_data_source/MyRootPackage/Moorings/Mooring"
        assert windTurbine["extends"] == ["system/SIMOS/DefaultUiRecipes", "system/SIMOS/NamedEntity"]

        specialMooring = folder_Moorings.search("SpecialMooring")
        assert len(specialMooring["extends"]) == 2

import io
import json
import unittest
from pathlib import Path
from uuid import UUID
from zipfile import ZipFile

from utils.import_package import package_tree_from_zip

"""
ROOT
 |
 |- WindTurbine.json
 |- myTurbine.json
 |- myPDF.json
 |- myNestedPDF.json
 |- myPDF.pdf
 |- Moorings
    |- Mooring.json
    |- SpecialMooring.json
    |- myTurbineMooring.json
|- A
    |- SubFolder
         |- myTurbine2.json
|- B
    |- myTurbine3.json
|- C # Empty folder
|- D
    |- E # Empty folder
"""

test_documents = {
    "MyRootPackage/WindTurbine.json": {
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
    "MyRootPackage/Moorings/Mooring.json": {
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
    "MyRootPackage/Moorings/SpecialMooring.json": {
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
    "MyRootPackage/myTurbine.json": {
        "name": "myTurbine",
        "type": "/WindTurbine",
        "description": "This is a wind turbine demoing uncontained relationships",
        "Mooring": {"_id": "apekatt", "type": "/Moorings/Mooring", "name": "myTurbineMooring"},
    },
    "MyRootPackage/test_pdf.pdf": None,
    "MyRootPackage/myPDF.json": {
        "name": "MyPdf",
        "type": "system/SIMOS/blob_types/PDF",
        "description": "Test",
        "blob": {"name": "/test_pdf.pdf", "type": "system/SIMOS/Blob"},
        "author": "Stig Oskar",
        "size": 4003782,
        "tags": ["Marine", "Renewable"],
    },
    "MyRootPackage/myNestedPDF.json": {
        "name": "myNestedPDF",
        "type": "system/SIMOS/Something",
        "description": "Test",
        "something": {
            "name": "bla",
            "type": "somethign/some/Thing",
            "blob": {"name": "/test_pdf.pdf", "type": "system/SIMOS/Blob"},
        },
        "author": "Stig Oskar",
        "size": 4003782,
        "tags": ["Marine", "Renewable"],
    },
    "MyRootPackage/Moorings/myTurbineMooring.json": {
        "_id": "apekatt",
        "name": "myTurbineMooring",
        "type": "/Moorings/Mooring",
        "description": "",
        "Bigness": 10,
    },
    "MyRootPackage/A/SubFolder/FileNameDoesNotMatch.json": {
        "name": "myTurbine2",
        "type": "/WindTurbine",
        "description": "This is a wind turbine demoing uncontained relationships",
        "Mooring": {"_id": "apekatt", "type": "/Moorings/Mooring", "name": "myTurbineMooring"},
    },
    "MyRootPackage/B/myTurbine3.json": {
        "name": "myTurbine3",
        "type": "/WindTurbine",
        "description": "This is a wind turbine demoing uncontained relationships",
        "Mooring": {"_id": "apekatt", "type": "/Moorings/Mooring", "name": "myTurbineMooring"},
    },
    "MyRootPackage/C/": None,
    "MyRootPackage/D/E/": None,
}


class ImportPackageTest(unittest.TestCase):
    def test_package_tree_from_zip_with_relative_references(self):
        memory_file = io.BytesIO()
        with ZipFile(memory_file, mode="w") as zip_file:
            for path, document in test_documents.items():
                if Path(path).suffix == ".json":
                    zip_file.writestr(path, json.dumps(document).encode())
                elif Path(path).suffix == ".pdf":
                    zip_file.write(f"{Path(__file__).parent}/../test_data/{Path(path).name}", path)
                elif path[-1] == "/":
                    zip_file.write(Path(__file__).parent, path)

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

        myPDF = root_package.search("MyPdf")
        assert isinstance(myPDF["blob"]["_blob_data_"], bytes)
        assert len(myPDF["blob"]["_blob_data_"]) == 531540
        assert root_package.search("D").search("E")  # Two empty packages

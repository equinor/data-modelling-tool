import unittest
import pytest

from rest.data_source_consumers.index import index_data_source

correct_index = {
    "blueprints/boxes/package.json": {
        "title": "Boxes",
        "description": "Many different boxes",
        "latestVersion": "blueprints/boxes/1.1.1/package.json",
        "versions": ["blueprints/boxes/1.1.1/package.json"],
        "children": ["blueprints/boxes/1.1.1/big/package.json", "blueprints/boxes/1.1.1/ordinary.json"],
        "nodeType": "folder",
        "isRoot": True,
        "id": "blueprints/boxes/package.json",
    },
    "blueprints/boxes/1.1.1/ordinary.json": {
        "title": "Ordinary-box",
        "description": "Pretty standard stuff here",
        "nodeType": "file",
        "isRoot": False,
        "id": "blueprints/boxes/1.1.1/ordinary.json",
    },
    "blueprints/boxes/1.1.1/big/big.json": {
        "title": "big-box",
        "description": "This is a very large box, its even in three dimensions",
        "nodeType": "file",
        "isRoot": False,
        "id": "blueprints/boxes/1.1.1/big/big.json",
    },
    "blueprints/boxes/1.1.1/big/package.json": {
        "title": "bigBoxes",
        "description": "Big boxes are kept in this subpackage",
        "documentType": "subpackage",
        "nodeType": "folder",
        "id": "blueprints/boxes/1.1.1/big/package.json",
        "isRoot": False,
        "children": ["blueprints/boxes/1.1.1/big/big.json"],
    },
}


class TestIndex(unittest.TestCase):
    @pytest.mark.skip(reason="no way of currently testing this")
    def test_index_data_source(self):
        """
        Testing the creation of an index of a data-source.
        A data-source with data needs to be available
        """
        data_sourceid = "5d5fe337f21d4b0f1d67dd02"
        result = index_data_source(data_sourceid=data_sourceid)
        self.assertEqual(result, correct_index)

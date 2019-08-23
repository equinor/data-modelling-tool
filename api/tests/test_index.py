from rest.index import index_data_source
import unittest

correct_index = [
    {
        "_id": "blueprints/propellers/package.json",
        "title": "propellers",
        "description": "cool sintef propeller model blueprints",
        "versions": [
            "blueprints/propellers/1.0.0/package.json",
            "blueprints/propellers/1.0.1/package.json"
        ],
        "latestVersion": "blueprints/propellers/1.0.0/package.json",
        "nodeType": "root-package"
    },
    {
        "_id": "blueprints/propellers/1.0.0/package.json",
        "title": "propellers",
        "description": "cool sintef propeller model blueprints",
        "documentType": "package",
        "version": "1.0.0",
        "subpackages": [
            "blueprints/propellers/1.0.0/big/package.json"
        ],
        "files": [
            "blueprints/propellers/1.0.0/ordinary-propeller.json"
        ],
        "nodeType": "subpackage"
    },
    {
        "_id": "blueprints/propellers/1.0.0/ordinary-propeller.json",
        "title": "propeller",
        "description": "A typical propeller blueprint",
        "nodeType": "file"
    },
    {
        "_id": "blueprints/propellers/1.0.0/big/package.json",
        "title": "propellers",
        "description": "big propellers",
        "documentType": "package",
        "files": [
            "blueprints/propellers/1.0.0/big/big-propeller.json"
        ],
        "nodeType": "subpackage"
    },
    {
        "_id": "blueprints/propellers/1.0.0/big/big-propeller.json",
        "title": "propeller",
        "description": "A typical propeller blueprint",
        "nodeType": "file"
    }
]


class TestIndex(unittest.TestCase):
    def test_index_data_source(self):
        """
        Testing the creation of an index of a data-source.
        A data-source with data needs to be available
        """
        data_source_id = '5d5fe337f21d4b0f1d67dd02'
        result = index_data_source(data_source_id=data_source_id)
        self.assertEqual(result, correct_index)

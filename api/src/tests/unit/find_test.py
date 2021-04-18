import unittest

from utils.data_structure.find import find


class FindTestCase(unittest.TestCase):
    def setUp(self):
        pass

    def test_when_dict(self):
        nested_dict = {
            "top": {
                "middle": {"nested": "value"},
                "list": [{"top": {"middle": {"nested": "value 1"}}}, {"top": {"middle": {"nested": "value 2"}}}],
            }
        }
        self.assertEqual(find(nested_dict, ["top", "middle", "nested"]), "value")
        self.assertEqual(find(nested_dict, ["top", "list", "[0]", "top", "middle", "nested"]), "value 1")
        self.assertEqual(find(nested_dict, ["top", "list", "[1]", "top", "middle", "nested"]), "value 2")
        self.assertRaises(IndexError, find, nested_dict, ["top", "list", "[2]"])
        self.assertRaises(KeyError, find, nested_dict, ["top", "middle", "uknown"])

    def test_when_list(self):
        list_of_nested_dicts = [
            {
                "top": {
                    "middle": {"nested": "value"},
                    "list": [{"top": {"middle": {"nested": "value 1"}}}, {"top": {"middle": {"nested": "value 2"}}}],
                }
            },
            {
                "top": {
                    "middle": {"nested": "value"},
                    "list": [{"top": {"middle": {"nested": "value 1"}}}, {"top": {"middle": {"nested": "value 2"}}}],
                }
            },
        ]
        self.assertEqual(find(list_of_nested_dicts, ["[0]", "top", "middle", "nested"]), "value")
        self.assertEqual(
            find(list_of_nested_dicts, ["[0]", "top", "list", "[0]", "top", "middle", "nested"]), "value 1"
        )
        self.assertEqual(
            find(list_of_nested_dicts, ["[0]", "top", "list", "[1]", "top", "middle", "nested"]), "value 2"
        )
        self.assertRaises(IndexError, find, list_of_nested_dicts, ["[2]"])
        self.assertRaises(KeyError, find, list_of_nested_dicts, ["[0]", "top", "middle", "unknown"])

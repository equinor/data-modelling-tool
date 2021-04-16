import unittest

from utils.data_structure.dictionary import merge_dicts


class MyTestCase(unittest.TestCase):
    def test_merge_three_dicts(self):
        first_dict = {"first": "value"}
        second_dict = {"second": "value"}
        third_dict = {"third": "value"}
        self.assertEqual(
            merge_dicts(first_dict, second_dict, third_dict), {"first": "value", "second": "value", "third": "value"}
        )

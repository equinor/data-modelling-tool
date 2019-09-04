import unittest

from utils.data_structure.traverse import traverse_compare


class TraverseTestCase(unittest.TestCase):
    def setUp(self):
        pass

    def test_actual_bigger_than_expected(self):
        actual = [{"key1": "value1"}, {"key2": "value2"}, {"key3": "value3"}]
        expected = [{"key1": "value1"}, {"key2": "value2"}]
        result = traverse_compare(actual, expected, ignoreIndexErrors=True, ignoreKeyErrors=True)
        self.assertEqual(result, [])

    def test_actual_bigger_than_expected_primitives(self):
        actual = ["a", "b", "c"]
        expected = ["a", "b"]
        result = traverse_compare(actual, expected, ignoreIndexErrors=True)
        self.assertEqual(result, [])

    def test_compare_identical_list_of_dicts(self):
        actual = [{"key3": "value3"}, {"key2": "value2"}, {"key1": "value1"}]
        expected = [{"key3": "value3"}, {"key2": "value2"}, {"key1": "value1"}]
        result = traverse_compare(actual, expected)
        self.assertEqual(result, [])

    def test_compare_not_identical_list_of_dicts(self):
        actual = [{"key3": "value3"}, {"key2": "value2"}, {"key1": "value1"}]
        expected = [{"key3": "value3"}, {"key2": "value2"}, {"key1": "value-1"}]
        result = traverse_compare(actual, expected)
        self.assertEqual(result, [{"expected_value": "value-1", "path": "[2].key1", "actual_value": "value1"}])

    def test_compare_identical_dictionaries(self):
        actual = {"top": {"middle": {"nested": "value"}}}
        expected = {"top": {"middle": {"nested": "value"}}}
        self.assertEqual(traverse_compare(actual, expected), [])

    def test_compare_not_identical_dictionaries(self):
        actual = {"top": {"middle": {"nested": "value"}}}
        expected = {"top": {"middle": {"nested": "wrong value"}}}
        self.assertEqual(
            traverse_compare(actual, expected),
            [{"expected_value": "wrong value", "path": "top.middle.nested", "actual_value": "value"}],
        )

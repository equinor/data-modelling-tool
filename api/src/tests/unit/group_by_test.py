import unittest

from utils.group_by import group_by


class GroupByTestCase(unittest.TestCase):
    def setUp(self):
        self.maxDiff = None

    def test_simple(self):
        items = [{"id": 1, "type": "string"}, {"id": 2, "type": "string"}]
        expected = {"string": [{"id": 1, "type": "string"}, {"id": 2, "type": "string"}]}
        actual = group_by(items=items, grouping_function=lambda item: item["type"])
        self.assertEqual(expected, actual)

    def test_expanded(self):
        class Person:
            def __init__(self, first_name, last_name, date_of_birth):
                self.first_name = first_name
                self.last_name = last_name
                self.date_of_birth = date_of_birth

        bob_fisher = Person("Bob", "Fisher", "1985-05-21")
        sara_miller = Person("Sara", "Miller", "1997-11-01")
        eve_miller = Person("Eve", "Miller", "1997-01-07")
        george_smith = Person("George", "Smith", "1956-09-25")
        items = [bob_fisher, sara_miller, eve_miller, george_smith]
        expected = {"Fisher": [bob_fisher], "Miller": [sara_miller, eve_miller], "Smith": [george_smith]}
        actual = group_by(items, lambda person: person.last_name)
        self.assertEqual(expected, actual)

        # Using the 'autogrouping' option
        expected = {"Bob": bob_fisher, "Sara": sara_miller, "Eve": eve_miller, "George": george_smith}
        actual = group_by(items, lambda person: person.first_name, auto_grouping=True)
        self.assertEqual(expected, actual)

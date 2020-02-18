import unittest

from classes.matrix import Matrix


class DefaultArrayTestCase(unittest.TestCase):
    def test_creation_of_default_array_simple(self):
        default_array = Matrix("*", "integer").create_default_array()

        assert default_array == []

    def test_creation_of_default_array_complex_type(self):
        default_array = Matrix("1,1", "system/DMT/Package").create_default_array()

        assert default_array == [[{}]]

    def test_creation_of_default_array_unfixed_rank2(self):
        default_array = Matrix("*,*", "integer").create_default_array()

        assert default_array == [[]]

    def test_creation_of_default_array_fixed_rank2(self):
        default_array = Matrix("2,1", "integer").create_default_array()
        # fmt: off
        assert default_array == [
            [0],
            [0],
        ]
        # fmt: on

    def test_creation_of_default_array_mixed_rank_string(self):
        default_array = Matrix("2,*,3", "string").create_default_array()
        # fmt: off
        assert default_array == [
            [["", "", ""]],
            [["", "", ""]],
        ]
        # fmt: on

    def test_creation_of_default_array_mixed_rank3_int(self):
        default_array = Matrix("2,2,*", "integer").create_default_array()
        expected = [[[], []], [[], []]]

        assert default_array == expected

    def test_creation_of_default_array_mixed_rank3_bool(self):
        default_array = Matrix("1,2,1", "boolean").create_default_array()
        expected = [[[False], [False]]]

        assert default_array == expected


if __name__ == "__main__":
    unittest.main()

import unittest

from core.use_case.utils.create_entity import create_default_array


class DefaultArrayTestCase(unittest.TestCase):
    @staticmethod
    def test_creation_of_default_array_simple():
        dimensions = "*"
        default_array = create_default_array(dimensions.split(","), int)

        assert default_array == []

    @staticmethod
    def test_creation_of_default_array_unfixed_rank2():
        dimensions = "*,*"
        default_array = create_default_array(dimensions.split(","), int)

        assert default_array == [[]]

    @staticmethod
    def test_creation_of_default_array_fixed_rank2():
        dimensions = "2,1"
        default_array = create_default_array(dimensions.split(","), int)
        # fmt: off
        assert default_array == [
            [0],
            [0],
        ]
        # fmt: on

    @staticmethod
    def test_creation_of_default_array_mixed_rank_string():
        dimensions = "2,*,3"
        default_array = create_default_array(dimensions.split(","), str)
        # fmt: off
        assert default_array == [
            [["", "", ""]],
            [["", "", ""]],
        ]
        # fmt: on

    @staticmethod
    def test_creation_of_default_array_mixed_rank3_int():
        dimensions = "2,2,*"
        default_array = create_default_array(dimensions.split(","), int)
        expected = [[[], []], [[], []]]

        assert default_array == expected

    @staticmethod
    def test_creation_of_default_array_mixed_rank3_bool():
        dimensions = "1,2,1"
        default_array = create_default_array(dimensions.split(","), bool)
        expected = [[[False], [False]]]

        assert default_array == expected


if __name__ == "__main__":
    unittest.main()

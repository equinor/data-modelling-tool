import json

from pygments import highlight
from pygments.formatters import TerminalFormatter
from pygments.lexers import JsonLexer

from utils.data_structure.traverse import traverse_compare


def print_pygments(json_object):
    json_str = json.dumps(json_object, indent=2, sort_keys=True)
    print(highlight(json_str, JsonLexer(), TerminalFormatter()))


def pretty_eq(expected, actual):
    try:
        a = traverse_compare(expected, actual)
        b = []
        if a != b:
            print("Actual:")
            print_pygments(actual)
            print("Expected:")
            print_pygments(expected)
            print("Differences:")
            print_pygments(a)
        assert a == b  # nosec
    except KeyError:
        print_pygments(actual)
        raise Exception
    except IndexError:
        print_pygments(actual)
        raise Exception
    except Exception:
        raise Exception

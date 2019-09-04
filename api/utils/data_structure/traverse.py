from utils.data_structure.dot_notation import find, to_dot_notation


def traverse(obj, path=None, callback=None):
    if path is None:
        path = []

    if isinstance(obj, dict):
        value = {}
        for k, v in obj.items():
            value[k] = traverse(v, path + [k], callback)
    elif isinstance(obj, list):
        value = [traverse(elem, path + [[i]], callback) for i, elem in enumerate(obj)]
    else:
        # no container, just values (str, int, float)
        value = obj

    # if a callback is provided, call it to get the new value
    if callback is None:
        return value
    else:
        return callback(path, value)


def traverse_compare(actual, expected, ignoreKeyErrors=False, ignoreIndexErrors=False):
    """
    Object properties matcher.

    Usage:
       >>> actual = {"top": {"middle" : {"nested": "value"}}}
       >>> expected = {"top": {"middle" : {"nested": "value"}}}
       >>> traverse_compare(actual, expected)
       []

    :param obj1: The actual object.
    :param obj2: The expected object.
    :param ignoreKeyErrors: Ignore missing keys.
    :param ignoreIndexErrors: Ignore missing list entries.
    :return: List of properties that does not match.
    """
    result = []

    # This will get called for every path/value in the structure
    def compare(path, actual_value):
        if isinstance(actual_value, (int, str, bool, float)):
            try:
                expected_value = find(expected, path)
                if actual_value != expected_value:
                    result.append(
                        {"path": to_dot_notation(path), "actual_value": actual_value, "expected_value": expected_value}
                    )
            except KeyError:
                print("I got a KeyError - path: %s" % str(to_dot_notation(path)))
                if not ignoreKeyErrors:
                    raise
            except IndexError:
                print("I got a IndexError - path: %s" % str(to_dot_notation(path)))
                if not ignoreIndexErrors:
                    raise
            except Exception:
                print("I got another exception - path: %s" % str(to_dot_notation(path)))
                raise

    traverse(actual, callback=compare)
    return result

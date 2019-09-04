def _get_value(obj, key):
    list_end = key.find("]")
    is_list = list_end > 0
    if is_list:
        list_index = int(key[list_end - 1])
        return obj[list_index]
    return obj[key]


def find(obj, path):
    try:
        # Base case
        if len(path) == 0:
            return obj
        key = str(path[0])
        rest = path[1:]
        nested = _get_value(obj, key)
        return find(nested, rest)
    except IndexError:
        raise IndexError
    except KeyError:
        raise KeyError
    except TypeError:
        raise TypeError

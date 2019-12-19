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


def has(obj, name: str):
    if isinstance(obj, dict):
        return name in obj
    return hasattr(obj, name)


def get(obj, name: str, **kwargs):
    use_default = "default" in kwargs
    if isinstance(obj, dict):
        try:
            return obj[name]
        except KeyError as e:
            if use_default:
                return kwargs["default"]
            raise e
    if use_default:
        return getattr(obj, name, kwargs["default"])
    else:
        return getattr(obj, name)

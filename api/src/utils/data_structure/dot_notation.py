import re

from utils.data_structure.find import find


def to_dot_notation(path):
    dot_path = []
    for index, path_entry in enumerate(path):
        if index == 0:
            dot_path.append(str(path_entry))
        # Next is not a list
        elif str(path_entry)[0] != "[":
            dot_path.append("." + str(path_entry))
        else:
            dot_path.append(str(path_entry))
    return "".join([str(dot_path_entry) for dot_path_entry in dot_path])


def to_path(dot_path):
    path = []
    for index, path_entry in enumerate(dot_path.split(".")):
        is_list_entry = "[" in path_entry
        # Ignore if the root is a list,
        # since it does not have a key for the list,
        # just check that the index is greater than zero.
        if index > 0 and is_list_entry:
            # A list entry is written like key[0] in dot notation,
            # we need to split these list entries into key and [0].
            for list_entry in re.split(r"(\[[0-9]\])", path_entry):
                if list_entry:
                    path.append(list_entry)
        else:
            path.append(path_entry)
    return path


def get_by_dot(obj, dot_path):
    return find(obj, to_path(dot_path))

from typing import Dict, List, TypeVar, Union

T = TypeVar("T")


def group_by(items: List[Union[Dict, T]], grouping_function, items_function=None, auto_grouping=False):
    """
    Takes a list of `dict` items and groups by grouping function
    :param items: List of dicts to group
    :param grouping_function: Grouping function
    :param grouping_function: Items function
    :param
    """
    grouping = {}
    for item in items:
        grouping_value = grouping_function(item)
        if items_function:
            item = items_function(item)
        if grouping_value not in grouping.keys():
            grouping[grouping_value] = []
        grouping[grouping_value].append(item)
    if auto_grouping:
        longest_list_length = max([len(grouping[key]) for key in grouping.keys()])
        if longest_list_length == 1:
            for key in grouping.keys():
                grouping[key] = grouping[key][0]
    return grouping

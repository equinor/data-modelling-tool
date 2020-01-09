from typing import List, Dict


def key_func(x):
    label = x["label"]
    defined_order = ["Actions", "New", "Rename", "Remove"]
    order = {key: i for i, key in enumerate(defined_order)}
    return order.get(label, 999)


def sort_menu_items(unsorted_menu_items: List[Dict]) -> List[Dict]:
    return sorted(unsorted_menu_items, key=key_func)

def replace_dict_keys(old_key, new_key, input_dict):
    """
    :param old_key: The key to replace from the dict.
    :param new_key: A string to rename the old key.
    :param input_dict: A complex dictionary.
    :return: A dict
    """
    if hasattr(input_dict, 'items'):
        for key, value in input_dict.items():
            if key == old_key:
                input_dict[new_key] = input_dict.pop(old_key)
            if isinstance(value, dict):
                input_dict[key] = replace_dict_keys(old_key, new_key, value)
            elif isinstance(value, list):
                new_value = []
                for i in value:
                    new_value.append(replace_dict_keys(old_key, new_key, i))
                input_dict[key] = new_value
    return input_dict

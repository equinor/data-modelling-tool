def get_absolute_path(files: [], data_source_id):
    absolute_paths = []
    for file in files:
        absolute_paths.append(f"{data_source_id}/{file}")
    return absolute_paths


def get_parent_id_strip_data_source(absolute_parent_id: str):
    if "/" in absolute_parent_id:
        return absolute_parent_id.split("/", 1)[1]
    else:
        return ""

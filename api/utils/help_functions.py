from classes.data_source import DataSource


def get_absolute_path(files: [], data_source: DataSource):
    absolute_paths = []
    for file in files:
        absolute_paths.append(f"{data_source.id}/{file}")
    return absolute_paths

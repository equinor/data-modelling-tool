import json
import os
from pathlib import Path


def load_attribute(attribute_type: str, file_path_to_data_source: str):
    assert file_path_to_data_source[-1] == "/"
    if attribute_type[0] == "/":
        #relative path
        return f"T{attribute_type.split('/')[-1]}"
    if attribute_type.split("/")[0] == "system":
        return f"T{attribute_type.split('/')[-1]}" #todo somehow create type for  system
    file_to_load = f"{file_path_to_data_source}{attribute_type}.json"
    with open(file_to_load) as blueprint_file:
        json_content = json.load(blueprint_file)
        return f"T{json_content['name']}"



def resolve_attribute_type(attribute_type: str, file_path_to_data_source: str):
    if attribute_type == "string" or attribute_type == "number" or attribute_type == "integer" or attribute_type == "boolean" or attribute_type == "object":
        return attribute_type
    else:
        return load_attribute(attribute_type=attribute_type, file_path_to_data_source=file_path_to_data_source)



def generate_blueprint_files_object():
    all_blueprint_files_object = {}
    blueprints_folder = "../api/src/home"
    appnames = os.listdir(blueprints_folder)

    for app in appnames:
        all_blueprint_files_object[f"{app}"] = {}
        data_sources = os.listdir(f"{blueprints_folder}/{app}/data")
        for data_source in data_sources:
            path_to_data_sources = f"{blueprints_folder}/{app}/data/{data_source}"
            if (not os.path.isdir(path_to_data_sources)):
                continue
            # Get the list of all files in directory tree at given path
            list_of_files = []
            for (dirpath, dirnames, filenames) in os.walk(path_to_data_sources):
                list_of_files += [os.path.join(dirpath, file) for file in filenames]

            # extract only blueprints
            list_of_blueprints = []
            for filepath in list_of_files:
                with open(filepath) as file:
                    if Path(filepath).suffix == ".json" or Path(filepath).suffix == ".JSON":
                        content = json.load(file)
                        if "type" in content and content["type"] == "system/SIMOS/Blueprint":
                            list_of_blueprints.append(filepath)
            all_blueprint_files_object[f"{app}"][f"{data_source}"] = list_of_blueprints
    return all_blueprint_files_object



def add_type_to_ts_file(data_source: str, json_file_path: str, typescript_file_name: str):

    """
    load blueprint from the file in "json_file_path", generate a typescript type from this and append the typescript
    type to the file "typescript_file_name"
    """
    assert ".ts" in typescript_file_name

    with open(json_file_path) as f:
        file_as_json = json.load(f)
        blueprint_name = file_as_json["name"]

    output: str = f"export type T{blueprint_name} = " + "{\n"

    with open(json_file_path) as json_file:
        json_content = json.load(json_file)
        if "attributes" not in json_content:
            #raise exception no attributes in file
            pass
        else:
            for attribute in json_content["attributes"]:
                attribute_is_optional = "optional" in attribute and attribute["optional"] == True
                if attribute_is_optional:
                    output += f"{attribute['name']}?: "
                else:
                    output += f"{attribute['name']}: "
                output += resolve_attribute_type(attribute["attributeType"], f"{json_file_path.rsplit(data_source, 1)[0]}")
                output += "\n"
            output += "}"
            if "extends" in json_content and len(json_content["extends"]) > 0:
                for extended_type in json_content["extends"]:
                    output += f" & T{extended_type.split('/')[-1]}"
            output += "\n\n"

            print(output)

    with open(typescript_file_name, "a") as output_file:
        output_file.write(output)


def generate_ts_file():
    all_blueprint_files_object = generate_blueprint_files_object()

    for home_folder in all_blueprint_files_object:
        for data_source in all_blueprint_files_object[home_folder]:
            file_name = f"{data_source}.ts"
            if os.path.isfile(file_name):
                os.remove(file_name)
            for file_path in all_blueprint_files_object[home_folder][data_source]:
                if "appMooring" in file_path:
                    continue
                elif "DMT-Inter" in file_path or "DMT-inter" in file_path:
                    pass  # todo handle alias
                else:
                    add_type_to_ts_file(data_source=data_source, json_file_path=file_path,
                                        typescript_file_name=file_name)


generate_ts_file()

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Union


def parse_alias_file(file_path: str) -> Dict[str, str]:
    regex = r"^[=A-Za-z0-9_-]*$"
    pattern = re.compile(regex)
    result: dict = {}
    try:
        with open(file_path) as alias_file:
            for line in alias_file.read().splitlines():
                if line.lstrip()[0] == "#":  # Skip commented lines
                    continue
                if not re.search(pattern, line):
                    raise ValueError(f"The alias file '{file_path}' is invalid. Invalid line '{line}'")
                key, value = line.split("=", 1)
                result[key] = value

    except FileNotFoundError:
        print("WARNING: No data source alias file found...")
    return result


def replace_aliases_in_settings(settings: dict) -> dict:
    def replace_alias_in_reference(reference: Union[str, None]) -> Union[str, None]:
        if not reference:
            return
        if reference[0] == "/":  # Don't replace relative references
            return reference
        reference_data_source = reference.split("/", 1)[0]
        return reference.replace(reference_data_source, aliases.get(reference_data_source, reference_data_source), 1)

    aliases = settings["dataSourceAliases"]

    new_models: List[str] = []
    for model in settings.get("models", []):
        new_models.append(replace_alias_in_reference(model))

    new_actions: List[dict] = []
    for action in settings.get("actions", []):
        action["input"] = replace_alias_in_reference(action.get("input"))
        action["output"] = replace_alias_in_reference(action.get("output"))
        new_actions.append(action)

    settings["models"] = new_models
    settings["actions"] = new_actions

    return settings


class Config:
    MONGO_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME", "maf")
    MONGO_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD", "maf")
    MONGO_URI = os.getenv("MONGO_URI", "")
    MONGO_DB = os.getenv("ENVIRONMENT", os.getenv("RADIX_ENVIRONMENT", "local"))
    LOGGER_LEVEL = os.getenv("LOGGING_LEVEL", "INFO")
    MAX_ENTITY_RECURSION_DEPTH = os.getenv("MAX_ENTITY_RECURSION_DEPTH", 50)
    API_DEBUG = os.getenv("API_DEBUG", 0)
    ENVIRONMENT = os.getenv("ENVIRONMENT", "local")
    DYNAMIC_MODELS = "dynamic_models"
    CACHE_MAX_SIZE = 200
    APPLICATION_HOME = os.getenv("APPLICATION_HOME", f"{Path(__file__).parent}/home")
    DMT_ENTITIES_HOME = f"{Path(__file__).parent}/demo_app_home"
    VERIFY_IMPORTS = os.getenv("DMT_VERIFY_IMPORTS", False)
    DMSS_API = os.getenv("DMSS_API", "http://dmss:5000")

    # Azure stuff
    # Where to run jobs in Azure
    JOB_SERVICE_ENABLED = bool(int(os.getenv("JOB_SERVICE_ENABLED", 0)))
    AZURE_JOB_SUBSCRIPTION = os.getenv("AZURE_JOB_SUBSCRIPTION")
    AZURE_JOB_RESOURCE_GROUP = os.getenv("AZURE_JOB_RESOURCE_GROUP")
    # Which ServicePrincipal to authenticate with
    AZURE_JOB_SP_SECRET = os.getenv("AZURE_SP_SECRET")
    AZURE_JOB_SP_CLIENT_ID = os.getenv("AZURE_JOB_CLIENT_ID")
    AZURE_JOB_SP_TENANT_ID = os.getenv("AZURE_JOB_TENANT_ID")

    # Allows for some per-deployment environment variables to be passed to jobs
    SCHEDULER_ENVS_TO_EXPORT = (
        os.getenv("SCHEDULER_ENVS_TO_EXPORT").split(",") if os.getenv("SCHEDULER_ENVS_TO_EXPORT") else []
    )

    # Redis stuff
    SCHEDULER_REDIS_PASSWORD = os.getenv("SCHEDULER_REDIS_PASSWORD")
    SCHEDULER_REDIS_HOST = os.getenv("SCHEDULER_REDIS_HOST", "job-store")
    SCHEDULER_REDIS_PORT = int(os.getenv("SCHEDULER_REDIS_PORT", 6379))
    SCHEDULER_REDIS_SSL = os.getenv("SCHEDULER_REDIS_SSL", "False").lower() == "true"

    APP_NAMES = next(os.walk(APPLICATION_HOME))[1]  # Every folder under HOME represents a separate app
    APP_SETTINGS: Dict[str, dict] = {}  # Dict holding settings for all loaded applications
    APPS_DATASOURCE_SUBFOLDER = "data_sources"

    def load_app_settings(self):
        for app in self.APP_NAMES:
            try:
                with open(f"{self.APPLICATION_HOME}/{app}/settings.json") as json_file:
                    app_settings: dict = json.load(json_file)
                    app_settings["fileLocation"] = json_file.name
                    app_settings["dataSourceAliases"] = parse_alias_file(
                        f"{self.APPLICATION_HOME}/{app}/data/_aliases_"
                    )

                    code_gen_folder = Path(f"{self.APPLICATION_HOME}/{app}/code_generators")
                    if code_gen_folder.is_dir():
                        app_settings["codeGenerators"] = os.listdir(str(code_gen_folder))

                    self.APP_SETTINGS[app_settings["name"]] = replace_aliases_in_settings(app_settings)
            except FileNotFoundError:
                raise FileNotFoundError(
                    f"No settings file found for the app '{app}'."
                    f"Each application requires a 'settings.json' file located at "
                    f"'{self.APPLICATION_HOME}/{{name-of-app}}/'"
                )
            except KeyError as e:
                raise KeyError(f"The settings file for the '{app}' application is invalid: {e}")
            print(f"Successfully loaded app '{app}'")


config = Config()
config.load_app_settings()

from config import config
import json
from fastapi import Request
from features.system.exceptions import SetApplicationSettingsForbidden


def set_application_settings_use_case(request: Request):
    application_name = request.query_params("APPLICATION")
    if config.ENVIRONMENT != "local":
        raise SetApplicationSettingsForbidden("Changing systems settings can only be done in local deployments.")
    try:
        with open(config.APP_SETTINGS.get(application_name).get("fileLocation"), "w") as f:
            request_data = json.dumps(request.json)
            f.write(request_data)
        config.load_app_settings()
        return "OK"
    except Exception as e:
        raise Exception(f"Failed to save the settings file. {e}")

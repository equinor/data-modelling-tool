import json

from config import Config
from core.shared import response_object as res
from core.shared import use_case as uc
from flask import request


class GetApplicationSettingsUseCase(uc.UseCase):
    def process_request(self, req):
        settings_file = request.args.get("settingsFile", None)
        if settings_file:
            with open(f"{Config.APPLICATION_HOME}/{settings_file}") as json_file:
                return res.ResponseSuccess(json.load(json_file))
        return res.ResponseSuccess(Config.ENTITY_APPLICATION_SETTINGS)

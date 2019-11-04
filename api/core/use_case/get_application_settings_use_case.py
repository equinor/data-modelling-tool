import json

from config import Config
from core.shared import response_object as res
from core.shared import use_case as uc


class GetApplicationSettingsUseCase(uc.UseCase):
    def process_request(self, req):
        with open(Config.SETTINGS_FILE) as settings_file:
            settings = json.load(settings_file)

        return res.ResponseSuccess(settings)

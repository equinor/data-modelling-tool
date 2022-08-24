import markupsafe

from config import config
from restful.exceptions import NotFoundException


def get_application_settings_use_case(application_name: str):
    """
    Return settings for a given applicaiton.
    If no application_name is given, return settings for all applications
    """
    if application_name:
        if application_name in config.APP_SETTINGS:  # Return settings for the specific application
            return config.APP_SETTINGS.get(application_name)
        else:
            raise NotFoundException(f"No application with name {markupsafe.escape(application_name)} is loaded")
    return config.APP_SETTINGS

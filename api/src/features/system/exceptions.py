class ApplicationNotFoundException(Exception):
    def __init__(self, message):
        self.message = message


class SetApplicationSettingsForbidden(Exception):
    def __init__(self, message):
        self.message = message

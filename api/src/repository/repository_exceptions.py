from config import Config


class RepositoryException(Exception):
    def __init__(self, message: str):
        super()
        self.message = message

    def __str__(self):
        return repr(self.message)


class EntityNotFoundException(RepositoryException):
    def __init__(self, uid):
        super().__init__(message=f"The entity, with id {uid} is not found")


class PluginNotLoadedException(RepositoryException):
    def __init__(self, plugin):
        super().__init__(
            message=f"'{plugin}' is not loaded. Make sure it's a proper python module, and located at '\
            {Config.APPLICATION_HOME}/code_generators/'. Plugins are only loaded at startup"
        )


class FileNotFoundException(Exception):
    def __init__(self, data_source_id=None, file=None, is_root=False):
        self.data_source_id = data_source_id if data_source_id else None
        self.file = file if file else None
        self.is_root = is_root

    def __str__(self):
        if self.data_source_id and self.file:
            return f"FileNotFoundException, data_source: {self.data_source_id} file: {self.file}"
        else:
            return "FileNotFoundException has been raised"

class RepositoryException(Exception):
    def __init__(self, message: str):
        super()
        self.message = message

    def __str__(self):
        return repr(self.message)


class EntityAlreadyExistsException(RepositoryException):
    def __init__(self, document_id):
        super().__init__(message=f"The document, with id {document_id} already exists")


class EntityNotFoundException(RepositoryException):
    def __init__(self, uid):
        super().__init__(message=f"The entity, with id {uid} is not found")


class InvalidDocumentNameException(RepositoryException):
    def __init__(self, name):
        super().__init__(
            message=f"'{name}' is a invalid document name. Only alphanumeric, underscore, and dash are allowed characters"
        )


class TemplateNotFound(RepositoryException):
    def __init__(self, template_id):
        super().__init__(message=f"The template with ID, {template_id}, was not found")


class RootPackageNotFoundException(Exception):
    def __init__(self, data_source_id=None, file=None):
        self.data_source_id = data_source_id if data_source_id else None
        self.file = file if file else None

    def __str__(self):
        if self.data_source_id and self.file:
            return f"RootPackageNotFoundException, data_source: {self.data_source_id} file: {self.file}"
        else:
            return f"RootPackageNotFoundException has been raised"


class FileNotFoundException(Exception):
    def __init__(self, data_source_id=None, file=None, is_root=False):
        self.data_source_id = data_source_id if data_source_id else None
        self.file = file if file else None
        self.is_root = is_root

    def __str__(self):
        if self.data_source_id and self.file:
            return f"FileNotFoundException, data_source: {self.data_source_id} file: {self.file}"
        else:
            return f"FileNotFoundException has been raised"


class DuplicateFileNameInPackageException(Exception):
    def __init__(self, data_source_id=None, path=None):
        self.data_source_id = data_source_id if data_source_id else None
        self.path = path if path else None

    def __str__(self):
        if self.data_source_id and self.path:
            return f"DuplicateFileNameInPackageException, '{self.data_source_id}/{self.path}' already exists"
        else:
            return f"DuplicateFileNameInPackageException has been raised"

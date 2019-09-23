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

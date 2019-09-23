class RepositoryException(Exception):
    def __init__(self, message: str):
        super(message)


class EntityAlreadyExistsException(RepositoryException):
    def __init__(self, document_id):
        super(f"The document, with id {document_id} already exists")


class EntityNotFoundException(RepositoryException):
    def __init__(self, uid: str):
        super(f"The entity, with id {uid} is not found")

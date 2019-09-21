class RepositoryException(Exception):
    def __init__(self, message: str):
        super(message)


class EntityAlreadyExistsException(RepositoryException):
    def __init__(self, document_id):
        super(f"The document, with id {document_id} already exists")

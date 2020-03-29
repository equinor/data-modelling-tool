from uuid import UUID


def is_valid_uuid(test_string: str, version: int = 4) -> bool:
    try:
        uid_obj = UUID(test_string, version=version)
    except ValueError:
        return False

    return str(uid_obj) == test_string

#!/usr/bin/env python3


def create_system_blueprints():
    from classes.schema import Factory
    from core.repository.file import TemplateRepositoryFromFile
    from utils.helper_functions import schemas_location

    template_repository = TemplateRepositoryFromFile(schemas_location())
    factory = Factory(template_repository, read_from_file=True)

    template_types = [
        "system/SIMOS/Blueprint",
        "system/SIMOS/Application",
        "system/DMT/Package",
        "system/SIMOS/AttributeTypes",
    ]

    overwrite = True
    for template_type in template_types:
        factory.write_domain(template_type, overwrite)
        overwrite = False


if __name__ == "__main__":
    import os

    os.environ["ENVIRONMENT"] = "local"
    create_system_blueprints()

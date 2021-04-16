#!/usr/bin/env python3


def create_system_blueprints():
    from domain_classes.schema import Factory
    from repository.file import LocalFileRepository

    template_repository = LocalFileRepository()
    factory = Factory(template_repository)

    template_types = [
        "system/SIMOS/Blueprint",
        "system/SIMOS/Application",
        "system/SIMOS/Package",
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

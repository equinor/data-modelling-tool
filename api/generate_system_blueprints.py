#!/usr/bin/env python3

from core.domain.schema import Factory
from core.repository.file.document_repository import TemplateRepositoryFromFile
from utils.helper_functions import schemas_location


def create_system_blueprints():
    template_repository = TemplateRepositoryFromFile(schemas_location())
    factory = Factory(template_repository, read_from_file=True)

    template_types = ["system/SIMOS/Blueprint", "system/SIMOS/Application", "system/DMT/Package"]

    overwrite = True
    for template_type in template_types:
        factory.write_domain(template_type, overwrite)
        overwrite = False


if __name__ == "__main__":
    create_system_blueprints()

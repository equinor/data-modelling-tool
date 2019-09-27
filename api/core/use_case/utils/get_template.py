from classes.data_source import DataSource
from core.domain.blueprint import Blueprint
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.repository_exceptions import EntityNotFoundException
from core.repository.repository_factory import RepositoryType
from core.repository.template_repository import get_template_by_name


def get_template_data_source_id(template_ref: str) -> str:
    return template_ref.split("/", 1)[0]


def get_template_name(template_ref: str) -> str:
    return template_ref.split("/")[-1]


def get_template(get_repository, template_ref: str) -> Blueprint:
    if get_template_data_source_id(template_ref) == "templates":
        return Blueprint.from_dict(get_template_by_name(get_template_name(template_ref)))
    else:
        data_source = DataSource(id=get_template_data_source_id(template_ref))
        remote_document_repository: MongoBlueprintRepository = get_repository(
            RepositoryType.BlueprintRepository, data_source
        )
        template = remote_document_repository.find_one(get_template_name(template_ref))
        if not template:
            raise EntityNotFoundException(uid=template_ref)

        return template

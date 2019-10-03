from classes.data_source import DataSource
from core.domain.blueprint import Blueprint
from core.repository.mongo.blueprint_repository import MongoBlueprintRepository
from core.repository.repository_factory import RepositoryType
from core.repository.template_repository import get_template_by_name


def _get_data_source_id(type: str) -> str:
    return type.split("/", 1)[0]


# TODO: We need to use whole path, not only the type name, e.g equinor-blueprints/animals/cat
def _get_type_name(type: str) -> str:
    return type.split("/")[-1]


def _is_dmt_template(type: str) -> bool:
    return _get_data_source_id(type) == "templates"


def _get_dmt_template(type: str) -> Blueprint:
    return Blueprint.from_dict(get_template_by_name(_get_type_name(type)))


def _get_remote_template(get_repository, type: str) -> Blueprint:
    data_source_id = _get_data_source_id(type)
    data_source = DataSource(id=data_source_id)
    blueprint_repository: MongoBlueprintRepository = get_repository(RepositoryType.BlueprintRepository, data_source)
    return blueprint_repository.find_one(_get_type_name(type))


# TODO: Rename get_templates to get_blueprint?
def get_template(get_repository, type: str) -> Blueprint:
    print(type)
    if _is_dmt_template(type):
        return _get_dmt_template(type)
    else:
        return _get_remote_template(get_repository, type)

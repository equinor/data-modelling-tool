from core.repository.repository_exceptions import EntityNotFoundException
from core.utility import BlueprintProvider
from utils.form_to_ui_schema import form_to_ui_schema
from utils.form_to_schema import form_to_schema
from core.shared import use_case as uc
from core.shared import response_object as res
from core.shared import request_object as req


class GenerateJsonSchemaRequestObject(req.ValidRequestObject):
    def __init__(self, type: str, ui_recipe: str):
        self.type = type
        self.ui_recipe = ui_recipe

    @classmethod
    def from_dict(cls, adict):
        invalid_req = req.InvalidRequestObject()

        if "type" not in adict:
            invalid_req.add_error("type", "is missing")

        if invalid_req.has_errors():
            return invalid_req

        return cls(type=adict.get("type"), ui_recipe=adict.get("ui_recipe"))


class GenerateJsonSchemaUseCase(uc.UseCase):
    def process_request(self, request_object: GenerateJsonSchemaRequestObject):
        type = request_object.type
        ui_recipe_name = request_object.ui_recipe
        blueprint_provider = BlueprintProvider()
        blueprint = blueprint_provider.get_blueprint(type)

        if not blueprint:
            raise EntityNotFoundException(uid=type)

        ui_recipes = form_to_ui_schema(blueprint)
        ui_schema = ui_recipes[ui_recipe_name] if ui_recipe_name in ui_recipes else {}
        blueprint_provider.invalidate_cache()
        return res.ResponseSuccess({"schema": form_to_schema(blueprint, ui_recipe_name), "uiSchema": ui_schema})

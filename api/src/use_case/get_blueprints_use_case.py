from typing import Dict

from restful import request_object as req
from restful import response_object as res
from restful import use_case as uc
from use_case.utils.get_related_blueprints import get_related_blueprints


class GetBlueprintsRequestObject(req.ValidRequestObject):
    def __init__(self, blueprint):
        self.blueprint = blueprint


class GetBlueprintsUseCase(uc.UseCase):
    def process_request(self, request_object: GetBlueprintsRequestObject):
        blueprint: str = request_object.blueprint

        related_blueprints: Dict = get_related_blueprints(blueprint)

        return res.ResponseSuccess(related_blueprints)

from core.shared import response_object as res
import traceback

from core.shared.request_object import ValidRequestObject


class UseCase(object):
    def execute(self, request_object):
        if not request_object:
            return res.ResponseFailure.build_from_invalid_request_object(request_object)
        try:
            return self.process_request(request_object)
        except Exception as exc:
            traceback.print_exc()
            return res.ResponseFailure.build_system_error("{}: {}".format(exc.__class__.__name__, "{}".format(exc)))

    def process_request(self, request_object: ValidRequestObject):
        raise NotImplementedError("process_request() not implemented by UseCase class")

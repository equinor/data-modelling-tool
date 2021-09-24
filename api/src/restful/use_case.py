import json
from dmss_api.exceptions import ServiceException, UnauthorizedException

from repository.repository_exceptions import (
    ApplicationNotLoadedException,
    FileNotFoundException,
    EntityNotFoundException,
    JobNotFoundException,
)
from restful import response_object as res
import traceback


class UseCase(object):
    def execute(self, request_object):
        if not request_object:
            return res.ResponseFailure.build_from_invalid_request_object(request_object)
        try:
            return self.process_request(request_object)
        except ServiceException as dmss_exception:
            return res.ResponseFailure.build_resource_error(dmss_exception)
        except (EntityNotFoundException, JobNotFoundException) as not_found:
            return res.ResponseFailure.build_resource_error(not_found.message)
        except FileNotFoundException as not_found:
            return res.ResponseFailure.build_resource_error(
                f"The file '{not_found.file}' was not found on data source '{not_found.data_source_id}'"
            )
        except ApplicationNotLoadedException as e:
            return res.ResponseFailure.build_resource_error(f"Failed to fetch index: {e.message}")
        except UnauthorizedException as e:
            message = json.loads(e.body)["detail"]
            return res.ResponseFailure.build_access_error(message)
        except Exception as exc:
            traceback.print_exc()
            return res.ResponseFailure.build_system_error("{}: {}".format(exc.__class__.__name__, "{}".format(exc)))

    def process_request(self, request_object):
        raise NotImplementedError("process_request() not implemented by UseCase class")

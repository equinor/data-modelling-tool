from dmt.utils import request


class DMT(object):
    """Construct a :class`SMT` object used for communicating
    with the DMT API.

    Usage:
    from dmt import DMT
    dmt = DMT()
    dmt.login()
    ...

    """

    def __init__(self):
        pass

    def _request(self, endpoint, data=None, files=None,
                 raise_for_status=True, req_type='post'):
        return request(endpoint, data, files,
                       raise_for_status, req_type)

    def get(self, data_source_id: str, document_id: str):
        """Get document

        Returns a dict containing...
        """
        r = self._request(endpoint=f"/v2/documents/{data_source_id}/{document_id}", req_type='get')
        result = r.json().get("document")
        return result

    def save(self, data_source_id: str, document_id: str, data: dict):
        if data is None:
            data = {}
        r = self._request(f"/v2/documents/{data_source_id}/{document_id}", data=data, req_type='put')
        print(r)
        return r.json().get("document")

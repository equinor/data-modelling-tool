from services.dmss import dmss_api


# TODO: Is this in use? Can only see in 'schemas'
class TemplateRepositoryFromDMSS:
    def get(self, template_type: str):
        return self[template_type]

    def __getitem__(self, template_type: str) -> dict:
        data_source, *rest = template_type.split("/")
        template_type = "/".join(rest)
        document = dmss_api.get_by_path(data_source, template_type)
        return document["document"]

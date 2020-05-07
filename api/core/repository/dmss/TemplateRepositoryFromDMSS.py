from services.data_modelling_document_service import document_api


class TemplateRepositoryFromDMSS:
    def get(self, template_type: str):
        return self[template_type]

    def __getitem__(self, template_type: str) -> dict:
        data_source, *rest = template_type.split("/")
        template_type = "/".join(rest)
        document = document_api.get_by_path(data_source, template_type)
        return document["document"]

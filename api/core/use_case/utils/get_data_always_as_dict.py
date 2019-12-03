from core.domain.dto import DTO


# Temporary to fix issue with data can be both dict and class
# This function should be removed after we have refactor document repository to only return dict
def get_data_always_as_dict(dto: DTO):
    data = dto.data
    if not isinstance(data, dict):
        data = data.to_dict()
    return DTO(data, uid=dto.uid)

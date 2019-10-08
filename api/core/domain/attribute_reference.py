class AttributeReference:
    def __init__(self, name: str, type: str, dimensions: str, value: str = None):
        self.name = name
        self.type = type
        self.dimensions = dimensions
        self.value = value

    def to_dict(self):
        result = {"name": self.name, "type": self.type, "dimensions": self.dimensions, "value": self.value}
        return result

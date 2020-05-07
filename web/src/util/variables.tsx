export enum DocumentType {
  ENTITIES = 'entities',
  BLUEPRINTS = 'blueprints',
}

export enum BlueprintEnum {
  BLUEPRINT = 'system/SIMOS/Blueprint',
  PACKAGE = 'system/SIMOS/Package',
  ENTITY = 'system/SIMOS/Entity',
  ENUM = 'system/SIMOS/Enum',
}

export enum NodeType {
  PACKAGE = 'system/SIMOS/Package',
  BLUEPRINT = 'system/SIMOS/Blueprint',
  BLUEPRINT_ATTRIBUTE = 'system/SIMOS/BlueprintAttribute',
  APPLICATION = 'system/SIMOS/Application',
  DATA_SOURCE = 'datasource',
  DOCUMENT_NODE = 'document-node',
}

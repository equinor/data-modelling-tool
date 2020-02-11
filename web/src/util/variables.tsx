export enum DocumentType {
  ENTITIES = 'entities',
  BLUEPRINTS = 'blueprints',
}

export enum BlueprintEnum {
  BLUEPRINT = 'system/SIMOS/Blueprint',
  PACKAGE = 'system/DMT/Package',
  ENTITY = 'system/DMT/Entity',
  ENUM = 'system/SIMOS/Enum',
}

export enum NodeType {
  PACKAGE = 'system/DMT/Package',
  BLUEPRINT = 'system/SIMOS/Blueprint',
  BLUEPRINT_ATTRIBUTE = 'system/SIMOS/BlueprintAttribute',
  APPLICATION = 'system/SIMOS/Application',
  DATA_SOURCE = 'datasource',
  DOCUMENT_NODE = 'document-node',
}

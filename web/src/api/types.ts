export enum NodeType {
  DMT_PACKAGE = 'templates/DMT/Package',
  SIMOS_BLUEPRINT = 'templates/SIMOS/Blueprint',
  SIMOS_BLUEPRINT_ATTRIBUTE = 'templates/SIMOS/BlueprintAttribute',
  DATA_SOURCE = 'datasource',
  DOCUMENT_NODE = 'document-node',
}

export type IndexNode = {
  id: string
  title: string
  nodeType: NodeType
  children?: string[]
  templateRef?: string
  meta?: object
  type: string
}

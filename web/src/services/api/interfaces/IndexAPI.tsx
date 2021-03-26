import { NodeType } from '../../../utils/variables'

export type IndexNode = {
  id: string
  title: string
  nodeType: NodeType
  children?: string[]
  templateRef?: string
  meta?: object
  type: string
  parentId: string
}

export type IndexNodes = {
  [key: string]: IndexNode
}

export interface IIndexAPI {
  getIndexByDataSource(
    dataSourceId: string,
    application: string
  ): Promise<IndexNodes>

  getIndexByDocument(
    nodeUrl: string,
    documentId: string,
    application: string
  ): Promise<IndexNodes>
}

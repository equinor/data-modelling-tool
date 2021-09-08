import { NodeType } from '../../../utils/variables'
import { NodeMetaData } from '../../../components/Tree'

export type IndexNode = {
  id: string
  title: string
  nodeType: NodeType
  children?: string[]
  templateRef?: string
  meta?: NodeMetaData
  type: string
  parentId: string
}

export type IndexNodes = {
  [key: string]: IndexNode
}

export interface IDmtAPI {
  getIndexByDataSource(
    dataSourceId: string,
    application: string,
    token: string
  ): Promise<IndexNodes>

  getIndexByDocument(
    nodeUrl: string,
    documentId: string,
    application: string,
    token: string
  ): Promise<IndexNodes>

  getSystemSettings(application?: string): Promise<any>

  postSystemSettings(application: string, data: any): Promise<any>
}

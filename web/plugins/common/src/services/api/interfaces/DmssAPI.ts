import { Reference, RenameRequest } from '../configs/gen'

export type DataSource = {
  id: string
  name: string
  type?: string
  host?: string
}
export interface DataSources extends Array<DataSource> {}

export interface IDmssAPI {
  createDocument(url: string, data: any, token: string): Promise<any>

  removeDocument(url: string, token: string): Promise<any>

  updateDocument(url: string, data: any): Promise<any>

  explorerDocumentRename(
    dataSourceId: string,
    renameRequest: RenameRequest
  ): Promise<any>

  updateDocumentById(
    dataSourceId: string,
    documentId: string,
    attribute: string,
    data: any
  ): Promise<any>

  searchDocuments(
    dataSourceId: string,
    query: any,
    sortByAttribute?: string
  ): Promise<any>

  getDocumentByPath(dataSourceId: string, path: string): Promise<any>

  getBlueprint(typeRef: string): Promise<any>

  getDocumentById(
    dataSourceId: string,
    documentId: string,
    attribute?: string
  ): Promise<any>

  addDocumentToParent(dataSourceId: string, data: any): Promise<any>

  insertDocumentReference(
    dataSourceId: string,
    documentDottedId: string,
    reference: Reference
  ): Promise<any>

  removeDocumentReference(
    dataSourceId: string,
    documentDottedId: string
  ): Promise<any>

  getAllDataSources(): Promise<DataSources>
}

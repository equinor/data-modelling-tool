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

  updateDocument(url: string, data: any, token: string): Promise<any>

  explorerDocumentRename(
    dataSourceId: string,
    renameRequest: RenameRequest,
    token: string
  ): Promise<any>

  updateDocumentById(
    dataSourceId: string,
    documentId: string,
    attribute: string,
    data: any,
    token: string
  ): Promise<any>

  searchDocuments(
    dataSourceId: string,
    query: any,
    token: string,
    sortByAttribute?: string
  ): Promise<any>

  getDocumentByPath(
    dataSourceId: string,
    path: string,
    token: string
  ): Promise<any>

  getBlueprint(typeRef: string, token: string): Promise<any>

  getDocumentById(
    dataSourceId: string,
    documentId: string,
    token: string,
    attribute?: string
  ): Promise<any>

  addDocumentToParent(
    dataSourceId: string,
    data: any,
    token: string
  ): Promise<any>

  insertDocumentReference(
    dataSourceId: string,
    documentDottedId: string,
    reference: Reference,
    token: string
  ): Promise<any>

  removeDocumentReference(
    dataSourceId: string,
    documentDottedId: string,
    token: string
  ): Promise<any>

  getAllDataSources(token: string): Promise<DataSources>
}

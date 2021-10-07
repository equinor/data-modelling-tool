import {
  BlueprintGetRequest,
  DataSourceSaveRequest,
  DocumentGetByIdRequest,
  DocumentGetByPathRequest,
  DocumentUpdateRequest,
  ExplorerAddRequest,
  ExplorerRenameRequest,
  GetDocumentResponse,
  ReferenceDeleteRequest,
  ReferenceInsertRequest,
  SearchRequest,
} from '../configs/gen'
import { DataSources } from './DataSource'

export interface IDmssAPI {
  createDocument(url: string, data: any, token: string): Promise<any>

  removeDocument(url: string, token: string): Promise<any>

  updateDocument(url: string, data: any, token: string): Promise<any>

  explorerDocumentRename(requestParameters: ExplorerRenameRequest): Promise<any>

  updateDocumentById(requestParameters: DocumentUpdateRequest): Promise<any>

  documentGetByPath(
    requestParameters: DocumentGetByPathRequest
  ): Promise<object>

  searchDocuments(requestParameters: SearchRequest): Promise<object>

  getBlueprint(requestParameters: BlueprintGetRequest): Promise<object>

  getDocumentById(
    requestParameters: DocumentGetByIdRequest
  ): Promise<GetDocumentResponse>

  addDocumentToParent(requestParameters: ExplorerAddRequest): Promise<any>

  insertDocumentReference(
    requestParameters: ReferenceInsertRequest
  ): Promise<object>

  saveDataSource(requestParameters: DataSourceSaveRequest): Promise<any>

  removeDocumentReference(
    requestParameters: ReferenceDeleteRequest
  ): Promise<object>

  getAllDataSources(): Promise<DataSources>
}

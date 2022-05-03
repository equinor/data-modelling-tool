import {
  BlueprintGetRequest,
  DataSourceSaveRequest,
  DocumentGetByIdRequest,
  DocumentGetByPathRequest,
  DocumentUpdateRequest,
  ExplorerAddRequest,
  ExplorerRenameRequest,
  GetAclRequest,
  ReferenceDeleteRequest,
  ReferenceInsertRequest,
  SearchRequest,
  SetAclRequest,
} from '../configs/gen'
import { DataSources } from './DataSource'
import { TAcl } from '../../../components/AccessControlList'

export interface IDmssAPI {
  createDocument(url: string, data: any, token: string): Promise<any>

  removeDocument(url: string, token: string): Promise<any>

  removeByPath(path: string, dataSource: string): Promise<any>

  updateDocument(url: string, data: any, token: string): Promise<any>

  explorerDocumentRename(requestParameters: ExplorerRenameRequest): Promise<any>

  updateDocumentById(requestParameters: DocumentUpdateRequest): Promise<any>

  documentGetByPath(
    requestParameters: DocumentGetByPathRequest
  ): Promise<object>

  searchDocuments(requestParameters: SearchRequest): Promise<object>

  getBlueprint(requestParameters: BlueprintGetRequest): Promise<object>

  getDocumentById(requestParameters: DocumentGetByIdRequest): Promise<any>

  addDocumentToParent(requestParameters: ExplorerAddRequest): Promise<any>

  insertDocumentReference(
    requestParameters: ReferenceInsertRequest
  ): Promise<object>

  saveDataSource(requestParameters: DataSourceSaveRequest): Promise<any>

  removeDocumentReference(
    requestParameters: ReferenceDeleteRequest
  ): Promise<object>

  getAllDataSources(): Promise<DataSources>

  getDocumentAcl(requestParameters: GetAclRequest): Promise<TAcl>

  setDocumentAcl(requestParameters: SetAclRequest): Promise<string>
}
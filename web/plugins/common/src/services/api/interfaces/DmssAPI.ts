import {
  BlueprintGetRequest,
  DataSourceSaveRequest,
  DocumentGetByIdRequest,
  DocumentGetByPathRequest,
  DocumentUpdateRequest,
  ExplorerAddRequest,
  ExplorerRenameRequest, GetAclRequest,
  GetDocumentResponse,
  ReferenceDeleteRequest,
  ReferenceInsertRequest,
  SearchRequest, SetAclRequest,
} from '../configs/gen'
import { DataSources } from './DataSource'
import {ACL} from "../types";

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

  getDocumentAcl(requestParameters: GetAclRequest): Promise<ACL>

  setDocumentAcl(requestParameters: SetAclRequest): Promise<string>

}

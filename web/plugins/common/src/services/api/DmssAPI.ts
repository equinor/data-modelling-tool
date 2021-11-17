import {
  BlobGetByIdRequest,
  BlueprintGetRequest,
  Configuration,
  DataSourceSaveRequest,
  DefaultApi,
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
} from './configs/gen'
import { DataSources } from './interfaces/DataSource'
import { IDmssAPI } from './interfaces/DmssAPI'
import axios from 'axios'
import { TAcl } from '@dmt/common'

const handleApiError = (error: any) => {
  // @ts-ignore
  if (typeof error.json !== 'function') {
    throw new Error(error)
  }
  return error.json().then((response: any) => {
    throw new Error(
      response.message || response.detail || JSON.stringify(response)
    )
  })
}

export class DmssAPI implements IDmssAPI {
  generatedDmssApi: DefaultApi

  constructor(token: string) {
    const DMSSConfiguration = new Configuration({
      basePath: '/dmss',
      accessToken: 'Bearer ' + token,
    })
    this.generatedDmssApi = new DefaultApi(DMSSConfiguration)
  }

  blobGetById(requestParameters: BlobGetByIdRequest): Promise<Blob> {
    return this.generatedDmssApi.blobGetById(requestParameters)
  }

  createDocument(url: string, data: any, token: string): Promise<any> {
    return axios.post(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  addDocumentToParent({
    dataSourceId,
    dottedId,
    body,
  }: ExplorerAddRequest): Promise<any> {
    return this.generatedDmssApi
      .explorerAdd({
        dataSourceId,
        dottedId,
        body,
      })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  documentGetByPath(
    requestParameters: DocumentGetByPathRequest
  ): Promise<object> {
    return this.generatedDmssApi
      .documentGetByPath(requestParameters)
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  getBlueprint({ typeRef }: BlueprintGetRequest): Promise<object> {
    return this.generatedDmssApi
      .blueprintGet({ typeRef })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  getDocumentById(requestParameters: DocumentGetByIdRequest): Promise<any> {
    return this.generatedDmssApi
      .documentGetById(requestParameters)
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  insertDocumentReference(
    requestParameters: ReferenceInsertRequest
  ): Promise<object> {
    return this.generatedDmssApi
      .referenceInsert(requestParameters)
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  removeDocumentReference(
    requestParameters: ReferenceDeleteRequest
  ): Promise<object> {
    return this.generatedDmssApi
      .referenceDelete(requestParameters)
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  removeDocument(url: string, token: string): Promise<any> {
    return axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  updateDocument(url: string, data: any): Promise<any> {
    return this.generatedDmssApi.documentUpdate(data)
  }

  explorerDocumentRename(
    requestParameters: ExplorerRenameRequest
  ): Promise<any> {
    return this.generatedDmssApi
      .explorerRename(requestParameters)
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  searchDocuments(requestParameters: SearchRequest): Promise<object> {
    return this.generatedDmssApi
      .search(requestParameters)
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  updateDocumentById(requestParameters: DocumentUpdateRequest): Promise<any> {
    return this.generatedDmssApi
      .documentUpdate(requestParameters)
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  saveDataSource(requestParameters: DataSourceSaveRequest): Promise<any> {
    return this.generatedDmssApi
      .dataSourceSave(requestParameters)
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  getAllDataSources(): Promise<DataSources> {
    return this.generatedDmssApi
      .dataSourceGetAll()
      .then((value: any) => {
        return JSON.parse(value)
      })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  getDocumentAcl(requestParameters: GetAclRequest): Promise<TAcl> {
    return this.generatedDmssApi.getAcl(requestParameters).catch((error) => {
      return handleApiError(error)
    })
  }

  setDocumentAcl(requestParameters: SetAclRequest): Promise<string> {
    return this.generatedDmssApi.setAcl(requestParameters).catch((error) => {
      return handleApiError(error)
    })
  }
}

export default DmssAPI

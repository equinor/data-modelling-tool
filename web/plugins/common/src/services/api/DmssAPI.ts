import { IDocumentAPI } from './interfaces/DocumentAPI'
import apiProvider from './utilities/Provider'
import { dmssApi } from './configs/StorageServiceAPI'
import { Reference, RenameRequest } from './configs/gen'

import { IDmssAPI, DataSources } from './interfaces/DmssAPI'

const handleApiError = (error: any) => {
  return error.json().then((response: any) => {
    throw new Error(
      response.message || response.detail || JSON.stringify(response)
    )
  })
}

// todo use this class instead of documentApi.tsx and DataSourceApi.tsx. also, create another wrapper for dmt api.... (indexapi.sx and systemapi.tsx)
export class DmssAPI implements IDmssAPI {
  createDocument(url: string, data: any, token: string): Promise<any> {
    return apiProvider.post(url, data, token)
  }

  addDocumentToParent(dataSourceId: string, data: any): Promise<any> {
    return dmssApi
      .explorerAddToParent({
        dataSourceId,
        addToParentRequest: data,
      })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  getDocumentByPath(dataSourceId: string, path: string): Promise<any> {
    return dmssApi
      .documentGetByPath({ dataSourceId, path })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }
  getBlueprint(typeRef: string): Promise<any> {
    return dmssApi.blueprintGet({ typeRef: typeRef }).catch((error: any) => {
      return handleApiError(error)
    })
  }

  getDocumentById(
    dataSourceId: string,
    documentId: string,
    attribute?: string
  ): Promise<any> {
    if (attribute) {
      return dmssApi
        .documentGetById({ dataSourceId, documentId, attribute })
        .catch((error: any) => {
          return handleApiError(error)
        })
    } else {
      return dmssApi
        .documentGetById({ dataSourceId, documentId })
        .catch((error: any) => {
          return handleApiError(error)
        })
    }
  }

  insertDocumentReference(
    dataSourceId: string,
    documentDottedId: string,
    reference: Reference
  ): Promise<any> {
    return dmssApi
      .referenceInsert({
        dataSourceId,
        documentDottedId,
        reference,
      })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  removeDocumentReference(
    dataSourceId: string,
    documentDottedId: string
  ): Promise<any> {
    return dmssApi
      .referenceDelete({ dataSourceId, documentDottedId })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  removeDocument(
    url: string,
    data: { parentId: string; documentId: string },
    token: string
  ): Promise<any> {
    return apiProvider.post(url, data, token)
  }

  updateDocument(url: string, data: any): Promise<any> {
    return dmssApi.documentUpdate(data).catch((error: any) => {
      return handleApiError(error)
    })
  }

  explorerDocumentRename(
    dataSourceId: string,
    renameRequest: RenameRequest
  ): Promise<any> {
    return dmssApi
      .explorerRename({ dataSourceId, renameRequest })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  searchDocuments(
    dataSourceId: string,
    query: any,
    sortByAttribute?: string
  ): Promise<any> {
    return dmssApi.search({
      dataSourceId: dataSourceId,
      body: query,
      sortByAttribute: sortByAttribute,
    })
  }

  updateDocumentById(
    dataSourceId: string,
    documentId: string,
    attribute: string,
    data: any,
    reference?: boolean
  ): Promise<any> {
    return dmssApi
      .documentUpdate({
        dataSourceId,
        documentId,
        body: data,
        attribute,
      })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  //from ddatasourceapi
  getAllDataSources(): Promise<DataSources> {
    return dmssApi
      .dataSourceGetAll()
      .then((value) => {
        return JSON.parse(value)
      })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }
}

export default DmssAPI

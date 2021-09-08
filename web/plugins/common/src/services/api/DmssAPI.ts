import apiProvider from './utilities/Provider'
import { Reference, RenameRequest } from './configs/gen'
import { IDmssAPI, DataSources } from './interfaces/DmssAPI'
import { Configuration, DefaultApi } from './configs/gen'

const handleApiError = (error: any) => {
  return error.json().then((response: any) => {
    throw new Error(
      response.message || response.detail || JSON.stringify(response)
    )
  })
}

export class DmssAPI implements IDmssAPI {
  token = ''
  generatedDmssApi: DefaultApi
  getBearerToken = () => {
    return 'Bearer ' + this.token
  }

  constructor() {
    const DMSSConfiguration = new Configuration({
      basePath: '/dmss',
      accessToken: this.getBearerToken,
    })
    this.generatedDmssApi = new DefaultApi(DMSSConfiguration)
  }

  createDocument(url: string, data: any, token: string): Promise<any> {
    return apiProvider.post(url, data, token)
  }

  addDocumentToParent(
    dataSourceId: string,
    data: any,
    token: string
  ): Promise<any> {
    this.token = token
    return this.generatedDmssApi
      .explorerAddToParent({
        dataSourceId,
        addToParentRequest: data,
      })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  getDocumentByPath(
    dataSourceId: string,
    path: string,
    token: string
  ): Promise<any> {
    this.token = token
    return this.generatedDmssApi
      .documentGetByPath({ dataSourceId, path })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }
  getBlueprint(typeRef: string, token: string): Promise<any> {
    this.token = token
    return this.generatedDmssApi
      .blueprintGet({ typeRef: typeRef })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  getDocumentById(
    dataSourceId: string,
    documentId: string,
    token: string,
    attribute?: string
  ): Promise<any> {
    this.token = token
    if (attribute) {
      return this.generatedDmssApi
        .documentGetById({ dataSourceId, documentId, attribute })
        .catch((error: any) => {
          return handleApiError(error)
        })
    } else {
      return this.generatedDmssApi
        .documentGetById({ dataSourceId, documentId })
        .catch((error: any) => {
          return handleApiError(error)
        })
    }
  }

  insertDocumentReference(
    dataSourceId: string,
    documentDottedId: string,
    reference: Reference,
    token: string
  ): Promise<any> {
    this.token = token
    return this.generatedDmssApi
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
    documentDottedId: string,
    token: string
  ): Promise<any> {
    this.token = token
    return this.generatedDmssApi
      .referenceDelete({ dataSourceId, documentDottedId })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  removeDocument(url: string, token: string): Promise<any> {
    this.token = token
    return apiProvider.remove(url, token)
  }

  updateDocument(url: string, data: any, token: string): Promise<any> {
    this.token = token
    return this.generatedDmssApi.documentUpdate(data).catch((error: any) => {
      return handleApiError(error)
    })
  }

  explorerDocumentRename(
    dataSourceId: string,
    renameRequest: RenameRequest,
    token: string
  ): Promise<any> {
    this.token = token
    return this.generatedDmssApi
      .explorerRename({ dataSourceId, renameRequest })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  searchDocuments(
    dataSourceId: string,
    query: any,
    token: string,
    sortByAttribute?: string
  ): Promise<any> {
    this.token = token
    return this.generatedDmssApi.search({
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
    token: string,
    reference?: boolean
  ): Promise<any> {
    this.token = token
    return this.generatedDmssApi
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

  getAllDataSources(token: string): Promise<DataSources> {
    this.token = token
    return this.generatedDmssApi
      .dataSourceGetAll()
      .then((value: any) => {
        return JSON.parse(value)
      })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }
}

export default DmssAPI

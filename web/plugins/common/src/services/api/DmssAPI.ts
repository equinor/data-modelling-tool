import apiProvider from './utilities/Provider'

import { Reference, RenameRequest } from './configs/gen'

import { IDmssAPI, DataSources } from './interfaces/DmssAPI'


import { Configuration, DefaultApi } from './configs/gen'
//@ts-ignore
import { getlocalStorageAccessToken } from '../../../../../app/src/context/auth/authentication'
// const getBearerToken = () => {
//   return 'Bearer ' + getlocalStorageAccessToken()
// }

//@ts-ignore
// const DMSSConfiguration = new Configuration({
//   basePath: '/dmss',
//   accessToken: getBearerToken,
// })
// let dmssApi = new DefaultApi(DMSSConfiguration)


const handleApiError = (error: any) => {
  return error.json().then((response: any) => {
    throw new Error(
      response.message || response.detail || JSON.stringify(response)
    )
  })
}

export class DmssAPI implements IDmssAPI {
  token = ""
  generatedDmssApi
  getBearerToken = () => {
  return 'Bearer ' + getlocalStorageAccessToken() //todo get token from inpu
}

  constructor(token: string) {
    this.token = token
    const DMSSConfiguration = new Configuration({
      basePath: '/dmss',
      accessToken: this.getBearerToken,
    })
    this.generatedDmssApi = new DefaultApi(DMSSConfiguration)
  }


  createDocument(url: string, data: any, token: string): Promise<any> {
    return apiProvider.post(url, data, token)
  }

  addDocumentToParent(dataSourceId: string, data: any): Promise<any> {
    return this.generatedDmssApi
      .explorerAddToParent({
        dataSourceId,
        addToParentRequest: data,
      })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  getDocumentByPath(dataSourceId: string, path: string): Promise<any> {
    return this.generatedDmssApi
      .documentGetByPath({ dataSourceId, path })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }
  getBlueprint(typeRef: string): Promise<any> {
    return this.generatedDmssApi.blueprintGet({ typeRef: typeRef }).catch((error: any) => {
      return handleApiError(error)
    })
  }

  getDocumentById(
    dataSourceId: string,
    documentId: string,
    attribute?: string
  ): Promise<any> {
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
    reference: Reference
  ): Promise<any> {
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
    documentDottedId: string
  ): Promise<any> {
    return this.generatedDmssApi
      .referenceDelete({ dataSourceId, documentDottedId })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }

  removeDocument(url: string, token: string): Promise<any> {
    return apiProvider.remove(url, token)
  }

  updateDocument(url: string, data: any): Promise<any> {
    return this.generatedDmssApi.documentUpdate(data).catch((error: any) => {
      return handleApiError(error)
    })
  }

  explorerDocumentRename(
    dataSourceId: string,
    renameRequest: RenameRequest
  ): Promise<any> {
    return this.generatedDmssApi
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
    reference?: boolean
  ): Promise<any> {
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

  
  
  //from ddatasourceapi
  getAllDataSources(): Promise<DataSources> {
    const testtoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiI5N2E2YjViZC02M2ZiLTQyYzYtYmI3NS03ZTVkZTIzOTRiYTAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vM2FhNGEyMzUtYjZlMi00OGQ1LTkxOTUtN2ZjZjA1YjQ1OWIwL3YyLjAiLCJpYXQiOjE2MzEwOTEyMTYsIm5iZiI6MTYzMTA5MTIxNiwiZXhwIjoxNjMxMDk1MTE2LCJhaW8iOiJFMlpnWVBncG85cXpQQ3hFcGVibHQxWm42MWhPQzVhZWlFbWlnZkpyalZ0MG1BdUZXbGY1NTUyOTMvZ2tiSk9YNXUxaUc4ZXBBQT09IiwiYXpwIjoiOTdhNmI1YmQtNjNmYi00MmM2LWJiNzUtN2U1ZGUyMzk0YmEwIiwiYXpwYWNyIjoiMCIsIm5hbWUiOiJLcmlzdGlhbiBLamVyc3RhZCIsIm9pZCI6IjkyOTU2Yzk3LWFiYjQtNDg1NC1iMzM4LTQ2ZTkxNTlkNDhjNCIsInByZWZlcnJlZF91c2VybmFtZSI6IktLSkVAZXF1aW5vci5jb20iLCJyaCI6IjAuQVFJQU5hS2tPdUsyMVVpUmxYX1BCYlJac0wyMXBwZjdZOFpDdTNWLVhlSTVTNkFDQUlNLiIsInNjcCI6ImRtc3NfdGVzdF9zY29wZSIsInN1YiI6IjdEQ0hnb1BLZWNoMHVUaGZQeGF3dlBHQ2xCZ3pxbURvMjZrNXJJaDdkbEkiLCJ0aWQiOiIzYWE0YTIzNS1iNmUyLTQ4ZDUtOTE5NS03ZmNmMDViNDU5YjAiLCJ1dGkiOiJZVDlYY0ZKUVgwRzJFaTZUNmYtU0FBIiwidmVyIjoiMi4wIn0.V-9aAkyvp2qqYeX5_bUJUEinHOJpoj54W89GYd_k76WH0nkkGFJx1hWWypUS7idIY5Toiu6jC1y31sewYLv3HYRN1EtAPRwDA622EYiT84_FhUIpVkb47Knsev3fRvGKQh2I2SUov6xsDDHcQxQRStxRHhBs2NnzN7xl8T1AfZnzs9JQIsQOQniWJaBS17AzvqLW-TwxN8IyBfD0oqIK7Mu0NZcJgHVJg7H-RrZUeCqWaoNrCk_AsS7B3IPuwQSE7DGtau-iKY-mCJ8AAnC_ZbjjbYl6pCnNzdQhcbAA5OS2iWu7MMhKrpjn1afmWW3EdXsywkPgr8OZRvnbnD0RxA"
    return this.generatedDmssApi
      .dataSourceGetAll()
      .then(value => {
        return JSON.parse(value)
      })
      .catch((error: any) => {
        return handleApiError(error)
      })
  }
}

export default DmssAPI

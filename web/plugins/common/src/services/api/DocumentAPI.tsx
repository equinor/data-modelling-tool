import { IDocumentAPI } from './interfaces/DocumentAPI'
import apiProvider from './utilities/Provider'
import { dmssApi } from './configs/StorageServiceAPI'
import { Reference, RenameRequest } from './configs/gen'

export class DocumentAPI implements IDocumentAPI {
  create(url: string, data: any): Promise<any> {
    /**
     *  TODO: Move create logic away from API and here like:
     *  root package: /add-package
     *  normal documents: /add-to-parent
     */
    return apiProvider.post(url, data)
  }

  addToParent(dataSourceId: string, data: any): Promise<any> {
    return dmssApi.explorerAddToParent({
      dataSourceId,
      addToParentRequest: data,
    })
            .catch((error: any) => {
          return error.json().then((response: any) => {throw new Error(`Error message from DMSS API: ${JSON.stringify(response)}`)})
        })
  }

  getByPath(dataSourceId: string, path: string): Promise<any> {
    return dmssApi.documentGetByPath({ dataSourceId, path })
            .catch((error: any) => {
          return error.json().then((response: any) => {throw new Error(`Error message from DMSS API: ${JSON.stringify(response)}`)})
        })
  }
  getBlueprint(typeRef: string): Promise<any> {
    return dmssApi.blueprintGet({ typeRef: typeRef })
            .catch((error: any) => {
          return error.json().then((response: any) => {throw new Error(`Error message from DMSS API: ${JSON.stringify(response)}`)})
        })
  }

  getById(
    dataSourceId: string,
    documentId: string,
    attribute?: string
  ): Promise<any> {
    if (attribute) {
      return dmssApi.documentGetById({ dataSourceId, documentId, attribute })
              .catch((error: any) => {
          return error.json().then((response: any) => {throw new Error(`Error message from DMSS API: ${JSON.stringify(response)}`)})
        })
    } else {
      return dmssApi.documentGetById({ dataSourceId, documentId })
              .catch((error: any) => {
          return error.json().then((response: any) => {throw new Error(`Error message from DMSS API: ${JSON.stringify(response)}`)})
        })
    }
  }

  insertReference(
    dataSourceId: string,
    documentDottedId: string,
    reference: Reference
  ): Promise<any> {
    return dmssApi.referenceInsert({
      dataSourceId,
      documentDottedId,
      reference,
    })
  }

  removeReference(
    dataSourceId: string,
    documentDottedId: string
  ): Promise<any> {
    return dmssApi.referenceDelete({ dataSourceId, documentDottedId })
  }

  remove(url: string, data: any): Promise<any> {
    return apiProvider.post(url, data)
  }

  update(url: string, data: any): Promise<any> {
    return dmssApi.documentUpdate(data)
            .catch((error: any) => {
          return error.json().then((response: any) => {throw new Error(`Error message from DMSS API: ${JSON.stringify(response)}`)})
        })
  }

  explorerRename(
    dataSourceId: string,
    renameRequest: RenameRequest
  ): Promise<any> {
    return dmssApi.explorerRename({ dataSourceId, renameRequest })
        .catch((error: any) => {
          return error.json().then((response: any) => {throw new Error(`Error message from DMSS API: ${JSON.stringify(response)}`)})
        })
  }

  search(dataSourceId: string, query: any): Promise<any> {
    return dmssApi.search({
      dataSourceId: dataSourceId,
      searchDataRequest: query,
    })
        .catch((error: any) => {
      return error.json().then((response: any) => {throw new Error(`Error message from DMSS API: ${JSON.stringify(response)}`)})
    })
  }

  updateById(
    dataSourceId: string,
    documentId: string,
    attribute: string,
    data: any,
    reference?: boolean
  ): Promise<any> {
    return dmssApi.documentUpdate({
      dataSourceId,
      documentId,
      body: data,
      attribute,
      reference,
    })
            .catch((error: any) => {
          return error.json().then((response: any) => {throw new Error(`Error message from DMSS API: ${JSON.stringify(response)}`)})
        })
  }
}

export default DocumentAPI

import { IDocumentAPI } from './interfaces/DocumentAPI'
import apiProvider from './utilities/Provider'
import { dmssApi } from './configs/StorageServiceAPI'

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
  }

  getByPath(dataSourceId: string, path: string): Promise<any> {
    return dmssApi.documentGetByPath({ dataSourceId, path })
  }
  getBlueprint(typeRef: string): Promise<any> {
    return dmssApi.getBlueprint({ typeRef: typeRef })
  }

  getById(
    dataSourceId: string,
    documentId: string,
    attribute?: string
  ): Promise<any> {
    if (attribute) {
      return dmssApi.documentGetById({ dataSourceId, documentId, attribute })
    } else {
      return dmssApi.documentGetById({ dataSourceId, documentId })
    }
  }

  remove(url: string, data: any): Promise<any> {
    return apiProvider.post(url, data)
  }

  update(url: string, data: any): Promise<any> {
    return dmssApi.documentUpdate(data)
  }

  updateById(
    dataSourceId: string,
    documentId: string,
    attribute: string,
    data: any
  ): Promise<any> {
    return dmssApi.documentUpdate({
      dataSourceId,
      documentId,
      body: data,
      attribute,
    })
  }
}

export default DocumentAPI

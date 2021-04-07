import apiProvider from './utilities/Provider'
import { IIndexAPI, IndexNodes } from './interfaces/IndexAPI'

export class IndexAPI implements IIndexAPI {
  async getIndexByDataSource(
    dataSourceId: string,
    application: string
  ): Promise<IndexNodes> {
    return apiProvider.get(
      `/api/v4/index/${dataSourceId}?APPLICATION=${application}`
    )
  }

  async getIndexByDocument(
    nodeUrl: string,
    documentId: string,
    application: string
  ): Promise<IndexNodes> {
    const url = `${nodeUrl}/${documentId}?APPLICATION=${application}`
    return apiProvider.get(url)
  }
}

export default IndexAPI

import { IIndexAPI, IndexNodes } from './interfaces/IndexAPI'
import { handleResponse } from './utilities/Response'
import axios from 'axios'

export class IndexAPI implements IIndexAPI {
  async getIndexByDataSource(
    dataSourceId: string,
    application: string
  ): Promise<IndexNodes> {
    return axios
      .get(`/api/v4/index/${dataSourceId}?APPLICATION=${application}`)
      .then(handleResponse)
  }

  async getIndexByDocument(
    nodeUrl: string,
    documentId: string,
    application: string
  ): Promise<IndexNodes> {
    return axios
      .get(`${nodeUrl}/${documentId}?APPLICATION=${application}`)
      .then(handleResponse)
  }
}

export default IndexAPI

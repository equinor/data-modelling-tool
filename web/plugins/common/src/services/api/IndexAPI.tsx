import { IIndexAPI, IndexNodes } from './interfaces/IndexAPI'
import { handleResponse } from './utilities/Response'
import axios from 'axios'

export class IndexAPI implements IIndexAPI {
  async getIndexByDataSource(
    dataSourceId: string,
    application: string,
    token: string
  ): Promise<IndexNodes> {
    return axios
      .get(`/api/v4/index/${dataSourceId}?APPLICATION=${application}`, {headers: {Authorization: `Bearer ${token}` }})
      .then(handleResponse)
  }

  async getIndexByDocument(
    nodeUrl: string,
    documentId: string,
    application: string,
    token: string
  ): Promise<IndexNodes> {
    return axios
      .get(`${nodeUrl}/${documentId}?APPLICATION=${application}`, {headers: {Authorization: `Bearer ${token}` }})
      .then(handleResponse)
  }
}

export default IndexAPI

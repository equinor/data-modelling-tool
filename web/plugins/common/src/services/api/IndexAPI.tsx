import { IIndexAPI, IndexNodes } from './interfaces/IndexAPI'
import { handleResponse } from './utilities/Response'
import axios from 'axios'
import {getlocalStorageAccessToken} from "../../../../../app/src/context/auth/authentication";

export class IndexAPI implements IIndexAPI {
  async getIndexByDataSource(
    dataSourceId: string,
    application: string
  ): Promise<IndexNodes> {
    return axios
      .get(`/api/v4/index/${dataSourceId}?APPLICATION=${application}`, {headers: {Authorization: `Bearer ${getlocalStorageAccessToken()}` }})
      .then(handleResponse)
  }

  async getIndexByDocument(
    nodeUrl: string,
    documentId: string,
    application: string
  ): Promise<IndexNodes> {
    return axios
      .get(`${nodeUrl}/${documentId}?APPLICATION=${application}`, {headers: {Authorization: `Bearer ${getlocalStorageAccessToken()}` }})
      .then(handleResponse)
  }
}

export default IndexAPI

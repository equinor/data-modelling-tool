import { IDmtAPI, IndexNodes } from './interfaces/DmtAPI'
import axios from 'axios'

export class DmtAPI implements IDmtAPI {
  async getIndexByDataSource(
    dataSourceId: string,
    application: string,
    token: string
  ): Promise<IndexNodes> {
    return axios
      .get(`/api/v4/index/${dataSourceId}?APPLICATION=${application}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data)
  }

  async getIndexByDocument(
    nodeUrl: string,
    documentId: string,
    application: string,
    token: string
  ): Promise<IndexNodes> {
    return axios
      .get(`${nodeUrl}/${documentId}?APPLICATION=${application}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: any) => res.data)
  }

  async getSystemSettings(application?: string) {
    if (application)
      return axios.get(`api/system/settings?APPLICATION=${application}`)
    return axios.get(`/api/system/settings`)
  }

  async postSystemSettings(application: string, data: any) {
    return axios.post(`/api/system/settings?APPLICATION=${application}`, data)
  }

  async createEntity(type: string, token: string) {
    return axios
      .post(
        '/api/entity',
        { name: '', type: type },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((respose) => {
        return respose.data
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

export default DmtAPI

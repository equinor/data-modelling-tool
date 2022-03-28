import { IDmtAPI } from './interfaces/DmtAPI'
import axios from 'axios'

export class DmtAPI implements IDmtAPI {
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

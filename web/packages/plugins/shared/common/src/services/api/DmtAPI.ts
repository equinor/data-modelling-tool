import { IDmtAPI } from './interfaces/DmtAPI'
import axios from 'axios'

export class DmtAPI implements IDmtAPI {
  token: string
  constructor(token: string) {
    this.token = token
  }

  async getSystemSettings(application?: string) {
    if (application)
      return axios.get(`api/system/settings?APPLICATION=${application}`)
    return axios.get(`/api/system/settings`)
  }

  async postSystemSettings(application: string, data: any) {
    return axios.post(`/api/system/settings?APPLICATION=${application}`, data)
  }

  async createEntity(type: string, name: string): Promise<string> {
    return axios
      .post(
        '/api/entity',
        { name: name, type: type },
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      )
      .then((respose) => {
        return respose.data
      })
  }
}

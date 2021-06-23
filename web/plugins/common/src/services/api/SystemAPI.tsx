import axios from 'axios'

class SystemApi {
  async getSystemSettings(application?: string) {
    if (application)
      return axios.get(`api/system/settings?APPLICATION=${application}`)
    return axios.get(`/api/system/settings`)
  }

  async postSystemSettings(application: string, data: any) {
    return axios.post(`/api/system/settings?APPLICATION=${application}`, data)
  }
}

export const systemAPI = new SystemApi()

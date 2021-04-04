import { Configuration, DefaultApi } from './gen'
import axios from 'axios'

const DMSSConfiguration = new Configuration({ basePath: '/dmss' })

export const dmssApi = new DefaultApi(DMSSConfiguration)

class SystemApi {
  async getSystemSettings() {
    return axios.get('api/system/settings')
  }

  async postSystemSettings(data: any) {
    return axios.post('api/system/settings', data)
  }
}

export const systemAPI = new SystemApi()

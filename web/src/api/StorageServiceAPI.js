import {
  Configuration,
  DatasourceApi,
  ExplorerApi,
  DocumentApi,
  SearchApi,
  BlobApi,
} from '../gen'
import axios from 'axios'

const DMT_BASE_PATH = `api/`
const DMSSConfiguration = new Configuration({ basePath: '/dmss/v1' })

export const dataSourceAPI = new DatasourceApi(DMSSConfiguration)
export const documentAPI = new DocumentApi(DMSSConfiguration)
export const BlobAPI = new BlobApi(DMSSConfiguration)
export const ExplorerAPI = new ExplorerApi(DMSSConfiguration)
export const SearchAPI = new SearchApi(DMSSConfiguration)

class SystemApi {
  async getSystemSettings() {
    return axios.get(`${DMT_BASE_PATH}system/settings`)
  }

  async postSystemSettings(data) {
    return axios.post(`${DMT_BASE_PATH}system/settings`, data)
  }
}

export const SystemAPI = new SystemApi()

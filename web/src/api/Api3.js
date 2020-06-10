import {
  Configuration,
  DatasourceApi,
  ExplorerApi,
  DocumentApi,
  SearchApi,
} from '../gen'
import axios from 'axios'

const DMT_BASE_PATH = `api/`
const DMSSConfiguration = new Configuration({ basePath: '/dmss/v1' })

export const DataSourceAPI = new DatasourceApi(DMSSConfiguration)
export const DocumentAPI = new DocumentApi(DMSSConfiguration)
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

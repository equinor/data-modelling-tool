import axios from 'axios'
import {getlocalStorageAccessToken} from "../../../../../app/src/context/auth/authentication";

class SystemApi {
  async getSystemSettings(application?: string) {
    if (application)
      return axios.get(`api/system/settings?APPLICATION=${application}`, {headers: {Authorization: `Bearer ${getlocalStorageAccessToken()}` }})
    return axios.get(`/api/system/settings`, {headers: {Authorization: `Bearer ${getlocalStorageAccessToken()}` }})
  }

  async postSystemSettings(application: string, data: any) {
    return axios.post(`/api/system/settings?APPLICATION=${application}`, data, {headers: {Authorization: `Bearer ${getlocalStorageAccessToken()}` }})
  }
}

export const systemAPI = new SystemApi()

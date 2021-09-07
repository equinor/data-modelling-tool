import axios from 'axios'
import { handleResponse, handleError } from './Response'

const get = (resource: string) => {
  return axios.get(`${resource}`).then(handleResponse).catch(handleError)
}

const post = (resource: string, model: any, token: string) => {
  return axios
    .post(`${resource}`, model, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(handleResponse)
    .catch((err) => {
      throw new Error(err.response.data.message)
    })
}

const put = (resource: string, model: any, token: string) => {
  return axios
    .put(`${resource}`, model, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(handleResponse)
    .catch((err) => {
      throw new Error(err)
    })
}

const patch = (resource: string, model: any, token: string) => {
  return axios
    .patch(`${resource}`, model, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(handleResponse)
    .catch(handleError)
}

const remove = (resource: string, token: string) => {
  return axios
    .delete(`${resource}`, { headers: { Authorization: `Bearer ${token}` } })
    .then(handleResponse)
    .catch(handleError)
}

export const apiProvider = {
  get,
  post,
  put,
  patch,
  remove,
}

export default apiProvider

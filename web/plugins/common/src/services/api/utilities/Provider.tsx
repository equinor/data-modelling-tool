import axios from 'axios'
import { handleResponse, handleError } from './Response'

const get = (resource: string) => {
  return axios
    .get(`${resource}`)
    .then(handleResponse)
    .catch(handleError)
}

const post = (resource: string, model: any) => {
  return axios
    .post(`${resource}`, model)
    .then(handleResponse)
    .catch(err => {
      throw new Error(err)
    })
}

const put = (resource: string, model: any) => {
  return axios
    .put(`${resource}`, model)
    .then(handleResponse)
    .catch(err => {
      throw new Error(err)
    })
}

const patch = (resource: string, model: any) => {
  return axios
    .patch(`${resource}`, model)
    .then(handleResponse)
    .catch(handleError)
}

const remove = (resource: string) => {
  return axios
    .delete(`${resource}`)
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

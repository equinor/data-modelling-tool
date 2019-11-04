import axios from 'axios'
import { DmtApi } from './Api'

const api = new DmtApi()

/**
 * Standardize client side api by forcing onSuccess callback to pass a DocumentData back.
 */
type OnSuccess = (data: any) => void
type OnError = (err: any) => void

export interface BASE_CRUD {
  onSuccess: OnSuccess
  onError?: OnError
}
interface FetchTemplate extends BASE_CRUD {
  url: string
}

interface Post {
  url: string
  data: object
  onSuccess: (res: any) => void
  onError: OnError
}

interface Get {
  url: string
  onSuccess: (res: any) => void
  onError: OnError
}

export default class Api2 {
  static download({ url, data, onSuccess, onError = () => {} }: Post) {
    console.debug(`Download ${url}`)
    axios({
      url: url,
      method: 'POST',
      data: data,
      responseType: 'blob', // important
    })
      .then(onSuccess)
      .catch(onError)
  }

  static post({ url, data, onSuccess, onError = () => {} }: Post) {
    console.debug(`Post ${url}`)
    axios
      .post(url, data)
      .then(onSuccess)
      .catch(onError)
  }

  static put({ url, data, onSuccess, onError = () => {} }: Post) {
    console.debug(`Put ${url}`)
    axios
      .put(url, data)
      .then(onSuccess)
      .catch(onError)
  }

  static get({ url, onSuccess, onError = () => {} }: Get) {
    console.debug(`Get ${url}`)
    axios
      .get(url)
      .then(response => onSuccess(response.data))
      .catch(onError)
  }

  static delete({ url, onSuccess, onError = () => {} }: Get) {
    console.debug(`Delete ${url}`)
    axios
      .delete(url)
      .then(response => onSuccess(response.data))
      .catch(onError)
  }

  static fetchCreateDatasource(selectedDatasourceType: string) {
    return ({ onSuccess, onError }: BASE_CRUD): void => {
      if (selectedDatasourceType === 'mongo-db') {
        fetchTemplate({ url: api.templatesDatasourceMongoGet(), onSuccess })
      } else {
        //@todo use selectedDatasourceType to use other template than mongo db.
        console.error(
          `template for ${selectedDatasourceType} is not supported.`
        )
      }
    }
  }

  static fetchApplicationSettings() {
    return ({ onSuccess, onError }: BASE_CRUD): void => {
      axios
        .get(api.applicationSettingsGet())
        .then(({ data }) => {
          onSuccess(data)
        })
        .catch(onError)
    }
  }

  static fetchWithTemplate({
    urlSchema,
    urlData,
    onSuccess,
    onError = () => {},
  }: any): void {
    axios
      .all([axios.get(urlSchema), axios.get(urlData)])
      .then(
        axios.spread((schemaRes, dataRes) => {
          onSuccess({
            document: dataRes.data.document.data,
            template: schemaRes.data,
          })
        })
      )
      .catch(onError)
  }

  static fetchDocument({ dataUrl, onSuccess, onError = () => {} }: any): void {
    axios
      .get(dataUrl)
      .then(({ data }) => {
        onSuccess(data)
      })
      .catch(onError)
  }
}

function fetchTemplate({
  url,
  onSuccess,
  onError = () => {},
}: FetchTemplate): void {
  axios(url)
    .then((res: any) => {
      onSuccess({
        document: {},
        blueprint: {
          schema: res.data.schema,
          uiSchema: res.data.uiSchema || {},
        },
      })
    })
    .catch(onError)
}

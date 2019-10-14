import axios from 'axios'
import { DmtApi, IndexRequestBody } from './Api'
import { DocumentData } from '../pages/blueprints/blueprint/types'

const api = new DmtApi()

/**
 * Standardize client side api by forcing onSuccess callback to pass a DocumentData back.
 */
type OnSuccess = (data: DocumentData) => void
type OnError = (err: any) => void

export interface BASE_CRUD {
  onSuccess: OnSuccess
  onError?: OnError
}
interface FetchTemplate extends BASE_CRUD {
  url: string
}

interface AddFile {
  dataSourceId: string
  parentId: string
  filename: string
  onSuccess: (res: any, dataSourceId: string) => void
  onError?: OnError
  templateRef?: string
  attribute?: string
  path?: string
  isContained?: boolean
}

interface AddEntitiy {
  nodeId: string
  filename: string
  onSuccess: (res: any, dataSourceId: string) => void
  onError?: OnError
  templateRef?: string
}

interface RemoveFile {
  dataSourceId: string
  filename: string
  onSuccess: () => void
  onError?: OnError
  templateRef?: string
}

interface RemoveFolder {
  dataSourceId: string
  filename: string
  onSuccess: (res: any) => void
  onError?: OnError
  templateRef?: string
}

interface RemoveRootPackage {
  nodeId: string
  onSuccess: (res: any, dataSourceId: string) => void
  onError?: OnError
}

interface AddRootPackage {
  dataSourceId: string
  filename: string
  onSuccess: (res: any, dataSourceId: string) => void
  onError?: OnError
  templateRef?: string
}

interface MoveFile {
  source: string
  destination: string
  onSuccess: (res: any) => void
  onError: OnError
  templateRef?: string
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

  static uploadPackageToRoot({
    dataSourceId,
    files,
    onSuccess,
    onError = () => {},
  }: {
    dataSourceId: string
    files: IndexRequestBody[]
    onSuccess: (data: any) => void
    onError?: (err: any) => void
  }) {
    const url = api.uploadPackageToRoot(dataSourceId)
    axios
      .post(url, files)
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
        template: {
          schema: res.data.schema,
          uiSchema: res.data.uiSchema || {},
        },
      })
    })
    .catch(onError)
}

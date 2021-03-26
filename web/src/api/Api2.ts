import axios from 'axios'

/**
 * TODO: Remove this whole API.
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

interface Post2 {
  url: string
  data: object
}

const templatesDatasourceMongoGet = (selectedDatasourceType: string) => {
  let template = ''

  // TODO: Cleanup constants
  if (selectedDatasourceType === 'mongo-db') template = 'MongoDataSource'
  if (selectedDatasourceType === 'azure-blob-storage')
    template = 'AzureBlobStorageDataSource'

  return `/api/v2/json-schema/apps/DMT/data-sources/${template}`
}

export default class Api2 {
  static post({
                url, data, onSuccess, onError = () => {
    },
              }: Post) {
    console.debug(`Post ${url}`)
    axios
      .post(url, data)
      .then(onSuccess)
      .catch(onError)
  }

  static post2({ url, data }: Post2) {
    console.debug(`Post ${url}`)
    return axios
      .post(url, data)
  }

  static put({
               url, data, onSuccess, onError = () => {
    },
             }: Post) {
    console.debug(`Put ${url}`)
    axios
      .put(url, data)
      .then(onSuccess)
      .catch(onError)
  }

  static put2({ url, data }: Post2) {
    console.debug(`Put ${url}`)
    return axios
      .put(url, data)
  }

  static get({
               url, onSuccess, onError = () => {
    },
             }: Get) {
    console.debug(`Get ${url}`)
    axios
      .get(url)
      .then(response => onSuccess(response.data))
      .catch(onError)
  }


  static fetchCreateDatasource(selectedDatasourceType: string) {
    return ({ onSuccess, onError }: BASE_CRUD): void => {
      fetchTemplate({
        url: templatesDatasourceMongoGet(selectedDatasourceType),
        onSuccess,
      })
    }
  }

  static fetchWithTemplate({
                             urlSchema,
                             urlData,
                             onSuccess,
                             onError = () => {
                             },
                           }: any): void {
    axios
      .all([axios.get(urlSchema), axios.get(urlData)])
      .then(
        axios.spread((schemaRes, dataRes) => {
          onSuccess({
            document: dataRes.data.document,
            template: schemaRes.data,
          })
        }),
      )
      .catch(onError)
  }

  static fetchDocument({
                         dataUrl, onSuccess, onError = () => {
    },
                       }: any): void {
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
                         onError = () => {
                         },
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

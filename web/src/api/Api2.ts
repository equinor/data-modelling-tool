import axios from 'axios'
import { DocumentData } from '../pages/blueprints/blueprint/FetchDocument'
import { DmtApi } from './Api'
import { NodeType } from '../components/tree-view/TreeReducer'

const api = new DmtApi()

/**
 * Standardize client side api by forcing onSuccess callback to pass a DocumentData back.
 */
type OnSuccess = (data: DocumentData) => void
type OnError = (err: any) => void

interface BASE_CRUD {
  onSuccess: OnSuccess
  onError?: OnError
}
interface FetchTemplate extends BASE_CRUD {
  url: string
}

/**
 * methods must static since we they are passed around, while the class instance is not.
 *
 * Fetch methods is a function or returns a function with callbacks as arguments.
 * This makes it possible to delay the actual fetch request.
 * All fetch methods respond with a DocumentData type in onSuccess, abstracting details of the backend endpoints.
 */
export default class Api2 {
  /**
   * Custom fetch since api actually responds with a DocumentData type.
   *
   * @param documentId absolute path of a document.
   */
  static fetchDocument(documentId: string) {
    return ({ onSuccess, onError = () => {} }: BASE_CRUD): void => {
      axios
        .get(api.documentTemplatesGet(documentId))
        .then((res: any) => {
          onSuccess(res.data)
        })
        .catch(onError)
    }
  }

  /**
   * Wraps fetchTemplate with a custom endpoint url.
   */
  static fetchCreateBlueprint({ onSuccess, onError }: BASE_CRUD) {
    fetchTemplate({
      url: api.templatesCreateBlueprintGet(),
      onSuccess,
      onError,
    })
  }

  /**
   * Wraps fetchTemplate with a custom endpoint url.
   */
  static fetchCreatePackage({ onSuccess, onError }: BASE_CRUD) {
    fetchTemplate({ url: api.templatesPackageGet(), onSuccess, onError })
  }

  /**
   * Wraps fetchTemplate with different template endpoints.
   */
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

  /**
   * FormData must have a non empty computer-friendly title property used to generate the filename and document id.
   *
   * @param parentId absolute path of parent.
   * @param formData
   * @param onSuccess @todo fix type
   * @param onError
   */
  static postCreateDocument({ parentId, formData, onSuccess, onError }: any) {
    const dataSourceId = parentId.split('/')[0]
    const url = api.packagePost(dataSourceId)
    axios
      .post(url, {
        meta: {
          name: formData.title,
          templateRef: 'templates/blueprint',
        },
        id: parentId + '/' + formData.title,
        nodeType: NodeType.file,
        isRoot: false,
        parentId: parentId,
        formData,
      })
      .then((res: any) => onSuccess(res))
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
        template: res.data.schema,
        uiSchema: res.data.uiSchema || {},
      })
    })
    .catch(onError)
}

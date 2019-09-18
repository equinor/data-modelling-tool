import axios from 'axios'
import { DocumentData } from '../pages/blueprints/blueprint/FetchDocument'
import { DmtApi } from './Api'
import { NodeType } from './types'
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

interface PostPackage {
  parentId: string
  formData: any
  nodeType: NodeType
  onSuccess: (res: any) => void
  onError?: OnError
  templateRef?: string
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
   * Creates a package, subpackage or file.
   * Covers:
   *   - create root-package (top-level node directly below datasource node.
   *   - create sub-package (all other packages)
   *   - create document (blueprint, entity)
   *
   * FormData must have a non empty computer-friendly title property used to generate the filename and document id.
   *
   * @param nodeType NodeType
   * @param formData
   * @param parentId absolute path
   * @param templateRef optional
   * @param onSuccess
   * @param onError
   */
  static postPackage({
    nodeType,
    formData,
    parentId,
    templateRef = 'templates/blueprint',
    onSuccess,
    onError = () => {},
  }: PostPackage) {
    const dataSourceId = parentId.split('/')[0]
    const url = api.packagePost(dataSourceId)
    const data = {
      meta: {
        name: formData.title,
        templateRef,
      },
      nodeType,
      parentId,
      formData,
    }
    axios
      .post(url, data)
      .then(response => onSuccess(response))
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

import axios from 'axios'
import { DocumentData } from '../pages/blueprints/blueprint/FetchDocument'
import { DmtApi } from './Api'
import { getDataSourceIDFromAbsolutID } from '../util/helperFunctions'

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

interface AddFile {
  nodeId: string
  filename: string
  onSuccess: (res: any, dataSourceId: string) => void
  onError?: OnError
  templateRef?: string
}

interface RemoveFile {
  nodeId: string
  filename: string
  onSuccess: (res: any, dataSourceId: string) => void
  onError?: OnError
  templateRef?: string
}

interface AddRootPackage {
  nodeId: string
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
        .get(api.getDocumentWithTemplate(documentId))
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
   * Wraps fetchTemplate with a custom endpoint url.
   */
  static fetchRemoveFile({ onSuccess, onError }: BASE_CRUD) {
    fetchTemplate({ url: api.templatesRemoveFile(), onSuccess, onError })
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

  static addBlueprintFile({
    nodeId,
    filename,
    templateRef = 'templates/blueprint',
    onSuccess,
    onError = () => {},
  }: AddFile) {
    // local-blueprints-equinor
    const dataSourceId = nodeId.split('/')[0]
    // root-package/1.0.0/subpackage/package
    const parentId = nodeId.substring(nodeId.indexOf('/') + 1)
    const url = api.addFile(dataSourceId)
    const data = {
      parentId,
      filename,
      templateRef,
    }
    axios
      .post(url, data)
      .then(response => onSuccess(response.data, dataSourceId))
      .catch(onError)
  }

  static addEntityFile({
    nodeId,
    filename,
    templateRef,
    onSuccess,
    onError = () => {},
  }: AddFile) {
    // local-blueprints-equinor
    const dataSourceId = nodeId.split('/')[0]
    // root-package/1.0.0/subpackage/package
    const parentId = nodeId.substring(nodeId.indexOf('/') + 1)
    const url = api.addFile(dataSourceId)
    const data = {
      parentId,
      filename,
      templateRef,
    }
    axios
      .post(url, data)
      .then(response => onSuccess(response.data, dataSourceId))
      .catch(onError)
  }

  static removeFile({
    nodeId,
    filename,
    onSuccess,
    onError = () => {},
  }: RemoveFile) {
    // local-blueprints-equinor
    const dataSourceId = nodeId.split('/')[0]
    // root-package/1.0.0/subpackage/package
    const packageId = nodeId.substring(nodeId.indexOf('/') + 1)
    const parentId = packageId.substring(0, packageId.lastIndexOf('/'))
    const url = api.removeFile(dataSourceId)
    const data = {
      parentId: `${parentId}/package`,
      filename: `${parentId}/${filename}`,
    }
    axios
      .post(url, data)
      .then(response =>
        onSuccess(response.data, `${dataSourceId}/${parentId}/package`)
      )
      .catch(onError)
  }

  static moveFile({ source, destination, onSuccess, onError }: MoveFile) {
    const data = {
      source: source,
      destination: destination,
    }
    const url = api.moveFile()
    axios
      .post(url, data)
      .then(response => onSuccess(response.data))
      .catch(error => onError(error))
  }

  static removeSubPackage({
    nodeId,
    filename,
    onSuccess,
    onError = () => {},
  }: RemoveFile) {
    // local-blueprints-equinor
    const dataSourceId = nodeId.split('/')[0]
    // root-package/1.0.0/subpackage/package
    const packageId = nodeId.substring(nodeId.indexOf('/') + 1)
    const packagePath = packageId.substring(0, packageId.lastIndexOf('/'))
    const parentId = packagePath.substring(0, packagePath.lastIndexOf('/'))
    const url = api.removeSubPackage(dataSourceId)
    const data = {
      parentId: `${parentId}/package`,
      filename: packageId,
    }
    axios
      .post(url, data)
      .then(response =>
        onSuccess(response.data, `${dataSourceId}/${parentId}/package`)
      )
      .catch(onError)
  }

  static addRootPackage({
    nodeId,
    filename,
    templateRef = 'templates/package-template',
    onSuccess,
    onError = () => {},
  }: AddRootPackage) {
    // local-blueprints-equinor
    const dataSourceId = nodeId.split('/')[0]
    const url = api.addRootPackage(dataSourceId)
    const data = {
      filename,
      templateRef,
    }
    axios
      .post(url, data)
      .then(response => onSuccess(response.data, dataSourceId))
      .catch(onError)
  }

  static addSubPackage({
    nodeId,
    filename,
    templateRef = 'templates/package',
    onSuccess,
    onError = () => {},
  }: AddFile) {
    // local-blueprints-equinor
    const dataSourceId = nodeId.split('/')[0]
    // root-package/1.0.0/subpackage/package
    const parentId = nodeId.substring(nodeId.indexOf('/') + 1)
    const url = api.addPackage(dataSourceId)
    const data = {
      parentId,
      filename,
      templateRef,
    }
    axios
      .post(url, data)
      .then(response => onSuccess(response.data, dataSourceId))
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
 * @param url
 */
function postPackage({
  nodeType,
  formData,
  parentId,
  templateRef,
  onSuccess,
  onError = () => {},
  url,
}: any) {
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

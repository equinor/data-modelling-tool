import axios from 'axios'
import values from 'lodash/values'

import Workspace from '../util/localWorkspace'
import { TreeNodeBuilderOld } from '../pages/common/tree-view/TreeNodeBuilderOld'
import { TreeNodeData } from '../components/tree-view/Tree'
import { NodeType } from './types'

function isLocal(datasource: Datasource): boolean {
  return datasource.id === 'local'
}

function toObject(acc: any, current: TreeNodeData) {
  ;(acc as any)[current.nodeId] = current
  return acc
}

export interface IndexRequestBody {
  id: string
  content: any
}

export interface PostIndexProp extends ApiPostProp {
  datasource: Datasource
  index: IndexRequestBody[]
}

export interface ApiPostProp {
  onSuccess?: () => void
  onError?: (error: any) => void
}

export abstract class BaseApi {
  public readonly dmtApi: DmtApi
  protected workspace: Workspace

  protected constructor() {
    this.dmtApi = new DmtApi()
    this.workspace = new Workspace()
  }

  abstract async post(props: ApiPostProp): Promise<any>
  abstract async get(props: any): Promise<any>
}

export class IndexApi extends BaseApi {
  public constructor() {
    super()
  }

  async post({
    datasource,
    index,
    onSuccess = () => {},
    onError = e => {},
  }: PostIndexProp) {
    const url = this.dmtApi.indexPost(datasource.id)
    axios
      .post(url, index)
      .then(res => {
        if (isLocal(datasource)) {
          this.workspace.setItem(url, res.data)
        } else {
          console.log('We have an index! ', res)
        }
        onSuccess()
      })
      .catch(e => {
        onError(e)
      })
  }

  async get(datasource: Datasource) {
    const url = this.dmtApi.indexGet(datasource.id)
    try {
      const res = !isLocal(datasource)
        ? (await axios(url)).data
        : this.workspace.getItem(url)

      const nodes = values(res)

      // map index to list of treeNodeData
      const indexNodes = nodes.map((node: IndexNode) =>
        new TreeNodeBuilderOld(node).build()
      )

      // concat datasourceNode and index, and transform to a object.
      return indexNodes.reduce(toObject, {})
    } catch (err) {
      console.error(err)
    }
    return {}
  }
}

export class DmtApi {
  dataSourcesGet(dataSourceType: DataSourceType): string {
    return `/api/v2/data-sources?documentType=${dataSourceType}`
  }

  dataSourcesPost(datasourceId: string) {
    return `/api/v2/data-sources/${datasourceId}`
  }

  indexGet(datasourceId: string) {
    return `/api/v3/index/${datasourceId}`
  }

  indexPost(dataSourceId: string): string {
    return `/api/index/${dataSourceId}`
  }

  templatesDatasourceMongoGet() {
    return `/api/v1/templates/mongodb-datasource-template`
  }

  templatesCreateBlueprintGet() {
    return `/api/v1/templates/create-blueprint`
  }

  templatesPackageGet() {
    return '/api/v1/templates/package-template'
  }

  templatesRemoveFile() {
    return '/api/v1/templates/remove-file'
  }

  // Explorer

  addFile(datasourceId: string) {
    return `/api/v2/explorer/${datasourceId}/add-file`
  }

  addEntityFile(datasourceId: string) {
    return `/api/explorer/${datasourceId}/add-entity-file`
  }

  removeFile(datasourceId: string) {
    return `/api/v2/explorer/${datasourceId}/remove-file`
  }

  moveFile() {
    return `/api/v2/explorer/move-file`
  }

  addPackage(datasourceId: string) {
    return `/api/v2/explorer/${datasourceId}/add-package`
  }

  removeSubPackage(datasourceId: string) {
    return `/api/v2/explorer/${datasourceId}/remove-package`
  }

  moveSubPackage() {
    return `/api/v2/explorer/move-package`
  }

  addRootPackage(datasourceId: string) {
    return `/api/v2/explorer/${datasourceId}/add-root-package`
  }

  removeRootPackage(datasourceId: string) {
    return `/api/v2/explorer/${datasourceId}/remove-root-package`
  }

  moveRootPackage() {
    return `/api/v2/explorer/move-root-package`
  }

  // Documents

  getDocumentWithTemplate(documentId: string): string {
    return `/api/v2/documents/${documentId}`
  }

  getJsonSchema(templateRef: string): string {
    return `/api/v2/json-schema/${templateRef}`
  }

  updateDocument(documentId: string) {
    return `/api/v2/documents/${documentId}`
  }
}

export enum DataSourceType {
  Blueprints = 'blueprints',
  Entities = 'entities',
}

export type Datasource = {
  id: string
  type: string
  host: string
  name: string
}

export type IndexNode = {
  id: string
  title: string
  nodeType: NodeType
  children?: string[]
  templateRef?: string
  meta?: object
}

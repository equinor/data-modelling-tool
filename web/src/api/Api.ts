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

      // find rootPackages that should be child of the datasource.
      const rootPackages = nodes.filter(
        (node: IndexNode) => node.nodeType === NodeType.rootPackage
      )

      // generate datasource treeDataNode.
      const datasourceTreeNode: TreeNodeData = new TreeNodeBuilderOld({
        id: datasource.id,
        nodeType: NodeType.datasource,
        title: datasource.id,
        children: rootPackages.map(
          (rootPackages: IndexNode) => rootPackages.id
        ),
      }).build()

      // map index to list of treeNodeData
      const indexNodes = nodes.map((node: IndexNode) =>
        new TreeNodeBuilderOld(node).build()
      )

      // concat datasourceNode and index, and transform to a object.
      return [datasourceTreeNode, ...indexNodes].reduce(toObject, {})
    } catch (err) {
      console.error(err)
    }
    return {}
  }
}

export class DmtApi {
  dataSourcesGet(dataSourceType: DataSourceType): string {
    return `/api/data-sources?documentType=${dataSourceType}`
  }

  dataSourcesPut(datasourceId: string) {
    return `/api/data-sources/${datasourceId}`
  }

  dataSourcesPost(datasourceId: string) {
    return `/api/data-sources/${datasourceId}`
  }

  dataSourcesDelete(datasourceId: string) {
    return `/api/data-sources/${datasourceId}`
  }

  indexGet(datasourceId: string) {
    return `/api/v2/index/${datasourceId}`
  }

  indexPost(dataSourceId: string): string {
    return `/api/index/${dataSourceId}`
  }

  templatesDatasourceMongoGet() {
    return `/api/templates/mongodb-datasource-template`
  }

  templatesBlueprintGet() {
    return `/api/templates/blueprint`
  }

  templatesCreateDocumentGet() {
    return `/api/templates/create-document`
  }

  templatesCreateBlueprintGet() {
    return `/api/templates/create-blueprint`
  }

  templatesPackageGet() {
    return '/api/templates/package-template'
  }

  packagePost(datasourceId: string) {
    return `/api/data-sources/${datasourceId}/packages`
  }

  documentGet(documentId: string): string {
    return `/api/data-sources/${documentId}`
  }

  documentTemplatesGet(documentId: string): string {
    return `/api/document-template/${documentId}`
  }

  documentPut(documentId: string) {
    return `/api/data-sources/${documentId}`
  }

  // Explorer

  addFile(datasourceId: string) {
    return `/api/explorer/${datasourceId}/add-file`
  }

  addPackage(datasourceId: string) {
    return `/api/explorer/${datasourceId}/add-package`
  }

  addRootPackage(datasourceId: string) {
    return `/api/explorer/${datasourceId}/add-root-package`
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
}

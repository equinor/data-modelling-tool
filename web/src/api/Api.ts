import axios from 'axios'
import values from 'lodash/values'

import Workspace from '../util/localWorkspace'
import { TreeNodeData } from '../components/tree-view/Tree'
import { NodeType } from './types'

function isLocal(datasource: Datasource): boolean {
  return datasource.id === 'local'
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

      let documents = nodes.map(node => {
        return {
          ...node,
          nodeId: node.id,
          isOpen: false,
          children: node.children ? node.children : [],
        }
      })

      const rootNodes = nodes.filter(
        (node: TreeNodeData) => node.nodeType === NodeType.rootPackage
      )

      documents = documents.map((node: TreeNodeData) => {
        return {
          ...node,
          isRoot: false,
          isOpen: false,
        }
      })

      const document: TreeNodeData = {
        nodeId: datasource.id,
        isRoot: true,
        isOpen: false,
        isHidden: false,
        title: datasource.name,
        nodeType: NodeType.datasource,
        children: rootNodes.map(rootNode => rootNode.id),
      }
      documents.push(document)

      return documents.reduce((obj, item) => {
        obj[item.nodeId] = item
        return obj
      }, {})
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
    return `/api/index/${datasourceId}`
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
  description: string
  latestVersion?: string
  versions: string[]
  nodeType: NodeType
  isRoot: boolean
  isOpen?: boolean
  children?: string[]
  meta?: object
}

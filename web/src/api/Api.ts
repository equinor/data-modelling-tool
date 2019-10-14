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
    let clientId = '00000000-0000-0000-0000-000000000000'
    const match = document.cookie.match(
      /AzureAppProxyUserSessionCookie_([\d]{8}(-[\d]{4}){3}-[\d]{12})/
    )
    if (match) {
      clientId = match[1]
    }
    // FIXME: Secure / do not allow sharing of these "local" databases by URL
    return `/api/v2/data-sources?documentType=${dataSourceType}&clientId=${clientId}`
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
    return `/api/v2/json-schema/system/DMT/data-sources/MongoDataSource`
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
  type: string
}

import axios from 'axios'
import values from 'lodash/values'

import Workspace from '../util/localWorkspace'
import { TreeNodeBuilderOld } from '../pages/common/tree-view/TreeNodeBuilderOld'
import { TreeNodeData } from '../components/tree-view/Tree'
import { NodeType } from '../util/variables'

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

  // @ts-ignore
  async get(datasource: Datasource, application) {
    const url = this.dmtApi.indexGet(datasource.id, application)
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
  dataSourcesGet(): string {
    return `/api/v2/data-sources`
  }

  addFile(): string {
    return '/api/v2/explorer/entities/add-file'
  }

  updateFile(dataSource: string | undefined, documentId: string): string {
    return `/api/v2/documents/${dataSource}/${documentId}`
  }

  getFile(dataSource: string | undefined, documentId: string): string {
    return `/api/v2/documents/${dataSource}/${documentId}`
  }

  applicationSettingsGet(settingsFile: string): string {
    return `/api/v2/system/settings?settingsFile=${settingsFile}`
  }

  dataSourcesPost(datasourceId: string) {
    return `/api/v2/data-sources/${datasourceId}`
  }

  indexGet(datasourceId: string, application: string) {
    if (application)
      return `/api/v4/index/${datasourceId}?APPLICATION=${application}`
    return `/api/v4/index/${datasourceId}`
  }

  indexPost(dataSourceId: string): string {
    return `/api/index/${dataSourceId}`
  }

  templatesDatasourceMongoGet(selectedDatasourceType: string) {
    let template = ''

    // TODO: Cleanup constants
    if (selectedDatasourceType === 'mongo-db') template = 'MongoDataSource'
    if (selectedDatasourceType === 'azure-blob-storage')
      template = 'AzureBlobStorageDataSource'

    return `/api/v2/json-schema/apps/DMT/data-sources/${template}`
  }

  jsonSchemaGet(blueprint: string, ui_recipe: string) {
    return `/api/v2/json-schema/${blueprint}?ui_recipe=${ui_recipe}`
  }
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

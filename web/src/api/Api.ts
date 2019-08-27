import axios from 'axios'

export class DmtApi {
  dataSourcesGet() {
    return axios('/api/data-sources')
  }
  indexGet(datasourceId: string) {
    return axios(`/api/index/${datasourceId}`)
  }

  templatesBlueprintGet() {
    // return axios(`/api/data-sources/${datasourceId}/templates/blueprint.json`)
    return axios(`/api/templates/blueprint.json`)
  }

  blueprintsGet(datasourceId: string, blueprintId: string) {
    return axios(`/api/data-sources/${datasourceId}/${blueprintId}`)
  }
}

export type Datasource = {
  _id: string
  type: string
  host: string
  name: string
}

export type IndexNode = {
  _id: string
  title: string
  description: string
  versions: string[]
  nodeType: string
  isRoot: boolean
  children?: string[]
}

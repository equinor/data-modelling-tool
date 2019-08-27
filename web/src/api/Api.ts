import axios from 'axios'

export class DmtApi {
  dataSourcesGet() {
    return axios('/api/data-sources')
  }
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

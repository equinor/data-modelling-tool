export class DmtApi {
  dataSourcesGet(dataSourceType: string): string {
    return `/api/data-sources/${dataSourceType}`
  }
  dataSourcesPut(datasourceId: string) {
    return `/api/data-sources/${datasourceId}`
  }
  dataSourcesPost() {
    return `/api/data-sources`
  }

  indexGet(datasourceId: string) {
    return `/api/index/${datasourceId}`
  }

  templatesDatasourceMongoGet() {
    return `/api/templates/data-sources/mongodb.json`
  }

  templatesBlueprintGet() {
    return `/api/templates/blueprint.json`
  }

  templatesPackageGet() {
    return '/api/templates/package.json'
  }

  documentGet(datasourceId: string, blueprintId: string): string | null {
    if (!datasourceId) {
      return null
    }
    return `/api/data-sources/${datasourceId}/${blueprintId}`
  }
  documentPut(datasourceId: string, blueprintId: string) {
    return `/api/data-sources/${datasourceId}/${blueprintId}`
  }
}

export enum DataSourceType {
  Blueprints = 'blueprints',
  Entities = 'entities',
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

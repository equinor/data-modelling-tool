export class DmtApi {
  dataSourcesGet(dataSourceType: string): string {
    return `/api/data-sources/${dataSourceType}`
  }
  dataSourcesPut(datasourceId: string) {
    return `/api/data-sources/${datasourceId}`
  }
  dataSourcesPost() {
    return `/api/data-sources/blueprints`
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

  packagePost(datasourceId: string) {
    return `/api/data-sources/${datasourceId}/packages`
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
  nodeType: 'folder' | 'file'
  isRoot: boolean
  isOpen?: boolean
  children?: string[]
}

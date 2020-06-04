import {
  Configuration,
  DatasourceApi,
  ExplorerApi,
  DocumentApi,
  SearchApi,
} from '../gen'

const APIConfiguration = new Configuration({ basePath: '/dmss/v1' })

export const DataSourceAPI = new DatasourceApi(APIConfiguration)
export const DocumentAPI = new DocumentApi(APIConfiguration)
export const ExplorerAPI = new ExplorerApi(APIConfiguration)
export const SearchAPI = new SearchApi(APIConfiguration)

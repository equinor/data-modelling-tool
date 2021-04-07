import { DataSources, IDataSourceAPI } from './interfaces/DataSourceAPI'
import { dataSourceAPI } from './configs/StorageServiceAPI'

export class DataSourceAPI implements IDataSourceAPI {
  getAll(): Promise<DataSources> {
    // @ts-ignore
    return dataSourceAPI.getAll()
  }
}

export default DataSourceAPI

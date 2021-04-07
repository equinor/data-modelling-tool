import { DataSources, IDataSourceAPI } from './interfaces/DataSourceAPI'
import { dmssApi } from './configs/StorageServiceAPI'

export class DataSourceAPI implements IDataSourceAPI {
  getAll(): Promise<DataSources> {
    // @ts-ignore
    return dmssApi.getAllApiV1DataSourcesGet()
  }
}

export default DataSourceAPI

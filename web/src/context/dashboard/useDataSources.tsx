import { useEffect, useReducer } from 'react'
import DataSourceReducer, {
  DocumentActions,
  initialState,
} from './DataSourcesReducer'
import {
  DataSource,
  DataSources,
  IDataSourceAPI,
} from '../../services/api/interfaces/DataSourceAPI'

export interface IModels {
  dataSources: DataSource[]
}

export interface IOperations {}

export interface IDataSources {
  models: IModels
  operations: IOperations
}

export default function useDataSources(
  dataSourceApi: IDataSourceAPI
): IDataSources {
  const [state, dispatch] = useReducer(DataSourceReducer, initialState)

  const fetchData = async () => {
    try {
      const dataSources = await dataSourceApi.getAll()
      dispatch(DocumentActions.addDataSources(dataSources))
    } catch {
      // TODO: Implement error handling
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    operations: {},
    models: {
      dataSources: state.dataSources,
    },
  }
}

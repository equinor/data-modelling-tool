import { useEffect, useReducer } from 'react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import DataSourceReducer, {
  DocumentActions,
  initialState,
} from './DataSourcesReducer'
import { DmssAPI, TDataSource } from '../services'

export interface IModels {
  dataSources: TDataSource[]
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOperations {}

export interface IDataSources {
  models: IModels
  operations: IOperations
}

export const useDataSources = (dmssAPI: DmssAPI): IDataSources => {
  const [state, dispatch] = useReducer(DataSourceReducer, initialState)

  const fetchData = async () => {
    try {
      const dataSources = await dmssAPI.dataSourceGetAll()
      //@ts-ignore
      dispatch(DocumentActions.addDataSources(dataSources))
    } catch (error) {
      console.error(error)
      NotificationManager.error(error.statusText, 'List DataSources')
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

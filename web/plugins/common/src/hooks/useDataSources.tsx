import { useEffect, useReducer } from 'react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import DataSourceReducer, {
  DocumentActions,
  initialState,
} from './DataSourcesReducer'
import { DmssAPI } from '../services'
import { DataSource } from '../services/api/interfaces/DataSource'

export interface IModels {
  dataSources: DataSource[]
}

export interface IOperations {}

export interface IDataSources {
  models: IModels
  operations: IOperations
}

export const useDataSources = (dmssAPI: DmssAPI): IDataSources => {
  const [state, dispatch] = useReducer(DataSourceReducer, initialState)

  const fetchData = async () => {
    try {
      const dataSources = await dmssAPI.getAllDataSources()
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

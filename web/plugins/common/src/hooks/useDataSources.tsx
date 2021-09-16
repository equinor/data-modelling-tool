import { useContext, useEffect, useReducer } from 'react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import DataSourceReducer, {
  DocumentActions,
  initialState,
} from './DataSourcesReducer'
import { DmssAPI } from '../services'
import { AuthContext } from '../../../../app/src/context/auth/AuthContext'
import { DataSource } from '../services/api/interfaces/DataSource'
import { IDmssAPI } from '../services/api/interfaces/DmssAPI'

export interface IModels {
  dataSources: DataSource[]
}

export interface IOperations {}

export interface IDataSources {
  models: IModels
  operations: IOperations
}

export const useDataSources = (dmssAPI: IDmssAPI): IDataSources => {
  const [state, dispatch] = useReducer(DataSourceReducer, initialState)
  if (!dmssAPI) dmssAPI = new DmssAPI()
  const { token } = useContext(AuthContext)

  const fetchData = async () => {
    try {
      const dataSources = await dmssAPI.getAllDataSources(token)
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

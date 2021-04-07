import {
  DataSource,
  DataSources,
} from '../../services/api/interfaces/DataSourceAPI'

const ADD_DATA_SOURCES = 'ADD_DATA_SOURCES'
const ADD_DATA_SOURCE = 'ADD_DATA_SOURCE'

export type DataSourcesState = {
  dataSources: DataSource[]
}

export const initialState: DataSourcesState = {
  dataSources: [],
}

export const DocumentActions = {
  addDataSources: (value: DataSources): object => ({
    type: ADD_DATA_SOURCES,
    value,
  }),

  addDataSource: (value: DataSource) => ({
    type: ADD_DATA_SOURCE,
    value,
  }),
}

export default (state: DataSourcesState, action: any) => {
  switch (action.type) {
    case ADD_DATA_SOURCES:
      return {
        ...state,
        dataSources: action.value,
        currentDatasourceId:
          action.value && action.value.length && action.value[0]._id,
      }
    case ADD_DATA_SOURCE:
      return {
        ...state,
        dataSources: [...state.dataSources, action.value],
      }

    default:
      return state
  }
}

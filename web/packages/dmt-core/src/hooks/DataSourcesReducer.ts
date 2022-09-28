import { TDataSource, TDataSources } from '../services'

const ADD_DATA_SOURCES = 'ADD_DATA_SOURCES'
const ADD_DATA_SOURCE = 'ADD_DATA_SOURCE'

type TDataSourcesState = {
  dataSources: TDataSource[]
}

export const initialState: TDataSourcesState = {
  dataSources: [],
}

export const DocumentActions = {
  addDataSources: (value: TDataSources): object => ({
    type: ADD_DATA_SOURCES,
    value,
  }),

  addDataSource: (value: TDataSource) => ({
    type: ADD_DATA_SOURCE,
    value,
  }),
}

export default (state: TDataSourcesState, action: any) => {
  switch (action.type) {
    case ADD_DATA_SOURCES:
      return {
        ...state,
        dataSources: action.value,
        currentDatasourceId:
          action.value && action.value.length && action.value[0].id,
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

import { Datasource } from '../../api/Api'

const ADD_DATASOURCES = 'ADD_DATASOURCES'
const ADD_DATASOURCE = 'ADD_DATASOURCE'

export type DocumentsAction = {
  type: string
  value?: any
}

export type DocumentsState = {
  currentDatasourceId: string
  dataSources: Datasource[]
}

export const initialState: DocumentsState = {
  currentDatasourceId: '',
  dataSources: [],
}

export const DocumentActions = {
  addDatasources: (value: any[]): object => ({
    type: ADD_DATASOURCES,
    value,
  }),

  addDataSource: (value: Datasource) => ({
    type: ADD_DATASOURCE,
    value,
  }),
}

export default (state: DocumentsState, action: any) => {
  switch (action.type) {
    case ADD_DATASOURCES:
      return {
        ...state,
        dataSources: action.value,
        currentDatasourceId:
          action.value && action.value.length && action.value[0]._id,
      }
    case ADD_DATASOURCE:
      return {
        ...state,
        dataSources: [...state.dataSources, action.value],
      }

    default:
      return state
  }
}

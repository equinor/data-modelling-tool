const VIEW_FILE = 'VIEW_FILE'
const EDIT_FILE = 'EDIT_FILE'
const SET_SELECTED_DOCUMENT_ID = 'SET_SELECTED_DOCUMENT_ID'
const ADD_DATASOURCES = 'ADD_DATASOURCES'
const ADD_DATASOURCE = 'ADD_DATASOURCE'

export enum PageMode {
  create,
  edit,
  view,
}

export type DataSource = {
  id: number
  label: string
  title: string
}

export type DocumentsAction = {
  type: string
  value?: any
}

export type DocumentsState = {
  selectedDocumentId: string
  dataSources: DataSource[]
  pageMode: PageMode
}

export const initialState: DocumentsState = {
  selectedDocumentId: '',
  dataSources: [],
  pageMode: PageMode.view,
}

export const DocumentActions = {
  setSelectedDocumentId: (id: string): DocumentsAction => ({
    type: SET_SELECTED_DOCUMENT_ID,
    value: id,
  }),

  addDatasources: (value: any[]): object => ({
    type: ADD_DATASOURCES,
    value,
  }),

  addDataSource: (value: DataSource) => ({
    type: ADD_DATASOURCE,
    value,
  }),
  viewFile: (id: string): DocumentsAction => ({
    type: VIEW_FILE,
    value: id,
  }),
  editFile: () => ({ type: EDIT_FILE }),
}

export default (state: DocumentsState, action: any) => {
  switch (action.type) {
    case SET_SELECTED_DOCUMENT_ID:
      return {
        ...state,
        selectedDocumentId: action.value,
      }
    case ADD_DATASOURCES:
      return {
        ...state,
        dataSources: action.value,
        selectedDataSourceId:
          action.value && action.value.length && action.value[0]._id,
      }
    case ADD_DATASOURCE:
      return {
        ...state,
        dataSources: [...state.dataSources, action.value],
      }

    case EDIT_FILE:
      return { ...state, pageMode: PageMode.edit }
    case VIEW_FILE:
      return {
        ...state,
        selectedDocumentId: action.value,
        pageMode: PageMode.view,
      }

    default:
      return state
  }
}

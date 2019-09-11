import { Datasource } from '../../api/Api'

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

export type DocumentsAction = {
  type: string
  value?: any
}

export type SetSelectedDocumentIdAction = {
  type: string
  value: any
  datasourceId: string
}

export type DocumentsState = {
  selectedDocumentId: string
  currentDatasourceId: string
  pageMode: PageMode
}

export const initialState: DocumentsState = {
  selectedDocumentId: '',
  currentDatasourceId: '',
  pageMode: PageMode.view,
}

export const DocumentActions = {
  setSelectedDocumentId: (
    id: string,
    datasourceId: string
  ): SetSelectedDocumentIdAction => ({
    type: SET_SELECTED_DOCUMENT_ID,
    value: id,
    datasourceId,
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
        currentDatasourceId: action.datasourceId,
        selectedDocumentId: action.value,
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

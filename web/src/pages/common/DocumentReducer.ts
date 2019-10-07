const VIEW_FILE = 'VIEW_FILE'
const EDIT_FILE = 'EDIT_FILE'
const SET_SELECTED_DOCUMENT_ID = 'SET_SELECTED_DOCUMENT_ID'

export enum PageMode {
  create,
  edit,
  view,
}

export type DocumentsAction = {
  type: string
  value?: any
}

export type DocumentsState = {
  dataUrl: string
  schemaUrl: string
  pageMode: PageMode
}

export const initialState: DocumentsState = {
  schemaUrl: '',
  dataUrl: '',
  pageMode: PageMode.view,
}

export const DocumentActions = {
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

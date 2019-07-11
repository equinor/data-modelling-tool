/**
 *  Trading simplicity in container for complexity in the reducer with nested state.
 *  To compensate, we need tests!
 *
 *  The reducer reuses the treeReducer. It's just extending TreeReducer.
 */

import TreeReducer, {
  Actions as CommonTreeActions,
  TreeActions,
} from '../../../components/tree-view/TreeReducer'
export const initialState = {
  nodes: {},
  modelFiles: {},
  formData: {},
  selectedTemplatePath: '',
}

export const TOGGLE_NODE = 'TOGGLE_NODE'
export const FILTER_TREE = 'FILTER_TREE'
const ADD_EXISTING = 'ADD_EXISTING'
const UPDATE_FORM_DATA = 'UPDATE_FORM_DATA'
const FETCH_MODEL = 'FETCH_MODEL'
const SET_SELECTED_TEMPLATE_PATH = 'SET_SELECTED_TEMPLATE_PATH'

interface CreateBlueprintActions extends TreeActions {
  addNodes: (node: any) => {}
  updateFormData: (path: string, formData: any) => {}
  fetchModel: (path: string, data: any) => {}
  setSelectedTemplatePath: (path: string) => {}
}

export const Actions: CreateBlueprintActions = {
  ...CommonTreeActions,
  addNodes: node => ({
    type: ADD_EXISTING,
    node,
  }),
  updateFormData: (path, formData) => ({
    type: UPDATE_FORM_DATA,
    path,
    formData,
  }),
  fetchModel: (path, data) => ({
    type: FETCH_MODEL,
    path,
    data,
  }),
  setSelectedTemplatePath: (path: string) => ({
    type: SET_SELECTED_TEMPLATE_PATH,
    path,
  }),
}

interface CreateBluePrintState {
  nodes: any
  selectedTemplatePath: string
  formData: any
  modelFiles: any
}

type CreateBluePrintAction = {
  type: string
  path: string
  node?: any
  data?: any
  formData?: any
}

export default (state: CreateBluePrintState, action: CreateBluePrintAction) => {
  switch (action.type) {
    case FILTER_TREE:
    case TOGGLE_NODE:
      const treeReducerNodes = TreeReducer(state.nodes, action)
      return { ...state, ...{ nodes: treeReducerNodes } }
    // return state;

    //new Blueprint
    case ADD_EXISTING:
      const newNode = Object.assign({}, action.node, { isRoot: true })
      const newNodes = { ...state.nodes, ...{ [action.node.path]: newNode } }
      return { ...state, ...{ nodes: newNodes } }

    case UPDATE_FORM_DATA:
      console.log(action)
      const newFormData = state.formData
      newFormData[action.path] = action.formData
      return { ...state, ...newFormData }

    case FETCH_MODEL:
      const newModelFiles = { ...state.modelFiles }
      newModelFiles[action.path] = action.data
      const newState = { ...state, ...{ modelFiles: newModelFiles } }
      return newState

    case SET_SELECTED_TEMPLATE_PATH:
      return { ...state, ...{ selectedTemplatePath: action.path } }

    default:
      console.error('not supported: ', action.type)
  }
}

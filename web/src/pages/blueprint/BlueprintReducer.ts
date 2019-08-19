import BlueprintTreeViewReducer, {
  ADD_ASSET,
  ADD_ASSETS,
  ADD_FILE,
  ADD_PACKAGE,
  ADD_ROOT_PACKAGE,
  BlueprintTreeViewActions,
  BlueprintTreeViewActionsTypes,
  FILTER_TREE,
  RESET_TREE,
  TOGGLE_NODE,
} from './tree-view/BlueprintTreeViewReducer'
import { Actions as CommonTreeActions } from '../../components/tree-view/TreeReducer'

const SET_SELECTED_DATASOURCE_ID = 'SET_SELECTED_DATASOURCE_ID'
const SET_ACTION = 'SET_ACTION'
const SET_OPEN = 'SET_OPEN'
const SET_SELECTED_BLUEPRINT_ID = 'SET_SELECTED_BLUEPRINT_ID'
const SET_PAGE_MODE = 'SET_PAGE_MODE'

export enum PageMode {
  create,
  edit,
  view,
}

export type Datasource = {
  id: number
  label: string
}

export type BlueprintAction = {
  type: string
  value: any
}

export type BlueprintState = {
  nodes: {}
  selectedDatasourceId: number
  selectedBlueprintId: string
  datasources: Datasource[]
  openModal: boolean
  treeviewAction: string
  pageMode: PageMode
  templateUrl: string
  dataUrl: string
}

const datasources = [
  { id: 0, label: 'Demo Blueprints', title: 'demo' },
  { id: 1, label: 'Equinor Blueprints', title: 'maf' },
  { id: 2, label: 'Local drive', title: 'local-files' },
]

export const blueprintInitialState: BlueprintState = {
  nodes: {},
  selectedDatasourceId: 0,
  selectedBlueprintId: '',
  datasources: datasources,
  openModal: false,
  treeviewAction: 'clear',
  pageMode: PageMode.view,
  templateUrl: '/api/blueprints/blueprint.json',
  dataUrl: ``,
}

export const BlueprintActions = {
  setSelectedDatasourceId: (id: number): BlueprintAction => ({
    type: SET_SELECTED_DATASOURCE_ID,
    value: id,
  }),
  setOpen: (open: boolean): BlueprintAction => ({
    type: SET_OPEN,
    value: open,
  }),
  setAction: (action: string): BlueprintAction => ({
    type: SET_ACTION,
    value: action,
  }),
  setSelectedBlueprintId: (id: string): BlueprintAction => ({
    type: SET_SELECTED_BLUEPRINT_ID,
    value: id,
  }),
  setPageMode: (pageMode: PageMode): BlueprintAction => ({
    type: SET_PAGE_MODE,
    value: pageMode,
  }),
  addRootPackage: (datasourceId: number): any => ({
    type: ADD_ROOT_PACKAGE,
    value: datasourceId,
  }),
  ...BlueprintTreeViewActions,
  ...CommonTreeActions,
}

export default (state: BlueprintState, action: BlueprintAction) => {
  switch (action.type) {
    case SET_SELECTED_DATASOURCE_ID:
      const datasource: any = state.datasources.find(
        ds => ds.id === state.selectedDatasourceId
      )
      console.log(action, datasource)
      const rootNode = {
        _id: datasource.title,
        title: datasource.title,
        isRoot: true,
        children: [],
      }
      const newState = {
        nodes: { ...state.nodes, ...rootNode },
        selectedDatasourceId: action.value,
        templateUrl: generateTemplateUrl(state),
        dataUrl: generateDataUrl(state, ''),
      }
      console.log(newState)
      return { ...state, ...newState }
    case SET_SELECTED_BLUEPRINT_ID:
      return {
        ...state,
        selectedBlueprintId: action.value,
        templateUrl: generateTemplateUrl(state),
        dataUrl: generateDataUrl(state, action.value),
      }
    case SET_OPEN:
      return { ...state, openModal: action.value }
    case SET_ACTION:
      return { ...state, treeviewAction: action.value }
    case SET_PAGE_MODE:
      return { ...state, pageMode: action.value }
    case ADD_ROOT_PACKAGE:
    case ADD_ASSETS:
    case ADD_ASSET:
    case ADD_FILE:
    case ADD_PACKAGE:
    case RESET_TREE:
    case FILTER_TREE:
    case TOGGLE_NODE:
      return state
    // return {...state, nodes: BlueprintTreeViewReducer(state.nodes, action)}
    default:
      return state
  }
}

function getDatasourceSubPath(state: any) {
  // uncomment when endpoint /api/blueprints/ is updated.
  // return '/' + state.datasources[state.selectedDatasourceId]
  return ''
}

function generateTemplateUrl(state: BlueprintState) {
  return `/api${getDatasourceSubPath(state)}/templates/blueprint.json`
}

function generateDataUrl(state: BlueprintState, selectedBlueprintId: string) {
  const path = selectedBlueprintId ? '/' + selectedBlueprintId : ''
  return `/api/${getDatasourceSubPath(state)}/blueprints${path}`
}

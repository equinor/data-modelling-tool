import TreeReducer, {
  Actions as CommonTreeActions,
  FILTER_TREE,
  TOGGLE_NODE,
} from '../../components/tree-view/TreeReducer'
import { GenerateTreeview } from '../../util/generateTreeview'

const ADD_NODES = 'ADD_NODES'
const ADD_PACKAGE = 'ADD_PACKAGE'
const CREATE_ROOT_NODE = 'CREATE_ROOT_NODE'
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
  title: string
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

const datasources: Datasource[] = [
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
  addNodes: (nodes: any[]): BlueprintAction => ({
    type: ADD_NODES,
    value: nodes,
  }),
  addRootPackage: (datasourceId: number): any => ({
    type: CREATE_ROOT_NODE,
    value: datasourceId,
  }),
  addPackage: (id: string): any => ({
    type: ADD_PACKAGE,
    value: id,
  }),
  ...CommonTreeActions,
}

function getDsTitle(state: BlueprintState) {
  return state.datasources[state.selectedDatasourceId].title
}

export default (state: BlueprintState, action: any) => {
  switch (action.type) {
    case SET_SELECTED_DATASOURCE_ID:
      const newState = {
        nodes: {},
        selectedDatasourceId: action.value,
        templateUrl: generateTemplateUrl(state),
        dataUrl: generateDataUrl(state, ''),
      }
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
    case ADD_NODES:
      const generateTreeView = new GenerateTreeview(state.nodes)
      const nodes = generateTreeView
        .addRootNode(getDsTitle(state))
        .addNodes(action.value, getDsTitle(state))
        .build()
      return { ...state, nodes }

    case FILTER_TREE:
    case TOGGLE_NODE:
      const treeNodes = TreeReducer(state.nodes, action)
      return { ...state, nodes: { ...treeNodes } }
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
  //strip datasource from selectedBlueprintId.
  const path = selectedBlueprintId.substr(selectedBlueprintId.indexOf('/'))
  return `/api/${getDatasourceSubPath(state)}/blueprints${path}`
}

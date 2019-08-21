import TreeReducer, {
  Actions as CommonTreeActions,
  FILTER_TREE,
  TOGGLE_NODE,
} from '../../components/tree-view/TreeReducer'
import { GenerateTreeview } from '../../util/generateTreeview'

const CREATE_BLUEPRINT = 'CREATE_BLUEPRINT'
const VIEW_FILE = 'VIEW_FILE'
const EDIT_FILE = 'EDIT_FILE'
const ADD_FILE = 'ADD_FILE'
const ADD_NODES = 'ADD_NODES'
const CLOSE_MODAL = 'CLOSE_MODAL'
const OPEN_PACKAGE = 'OPEN_PACKAGE'
const ADD_PACKAGE = 'ADD_PACKAGE'
const SET_SELECTED_DATASOURCE_ID = 'SET_SELECTED_DATASOURCE_ID'

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
  value?: any
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

const datasources: Datasource[] = [{ id: 0, label: 'Blueprints', title: 'maf' }]

export const blueprintInitialState: BlueprintState = {
  nodes: {},
  selectedDatasourceId: 0,
  selectedBlueprintId: '',
  datasources: datasources,
  openModal: false,
  treeviewAction: 'clear',
  pageMode: PageMode.view,
  templateUrl: '/api/templates/blueprint.json',
  dataUrl: ``,
}

export const BlueprintActions = {
  /**
   * Updates datasource.
   * @param id datasource Id
   */
  setSelectedDatasourceId: (id: number): BlueprintAction => ({
    type: SET_SELECTED_DATASOURCE_ID,
    value: id,
  }),
  /**
   * Close modal. Typically on cancel or close button.
   */
  closeModal: () => ({ type: CLOSE_MODAL }),

  openModal: (id: string, action: string): any => ({
    type: OPEN_PACKAGE,
    id,
    action,
  }),
  /**
   * Add nodes to state, usually index fetched from the api.
   * @param nodes index
   */
  addNodes: (nodes: any[]): BlueprintAction => ({
    type: ADD_NODES,
    value: nodes,
  }),
  /**
   * Adds a package to nodes object.
   * @param id path of package
   */
  addPackage: (id: string) => ({
    type: ADD_PACKAGE,
    value: id,
  }),
  /**
   * Adds a package to nodes object.
   * @param id path of file.
   */
  addFile: (id: string) => ({
    type: ADD_FILE,
    value: id,
  }),
  /**
   * Adds a blueprint to nodes.
   * @param id path of blueprint including filename.
   */
  createBlueprint: (id: string): BlueprintAction => ({
    type: CREATE_BLUEPRINT,
    value: id,
  }),
  /**
   * Sets selectedBlueprintId and correct pageMode
   * @param id path of file
   */
  viewFile: (id: string): BlueprintAction => ({
    type: VIEW_FILE,
    value: id,
  }),
  /**
   * Sets correct pageMode.
   */
  editFile: () => ({ type: EDIT_FILE }),

  ...CommonTreeActions,
}

function getDsTitle(state: BlueprintState) {
  return state.datasources[state.selectedDatasourceId].title
}

export default (state: BlueprintState, action: any) => {
  const nodeBuilder = new GenerateTreeview(state.nodes)
  switch (action.type) {
    /*
        General Actions
     */
    case SET_SELECTED_DATASOURCE_ID:
      const newState = {
        nodes: {},
        selectedDatasourceId: action.value,
        templateUrl: generateTemplateUrl(state),
        dataUrl: generateDataUrl(state, ''),
      }
      return { ...state, ...newState }
    /*
        MODAL ACTIONS
     */
    case CLOSE_MODAL:
      return { ...state, openModal: false }
    case OPEN_PACKAGE:
      return {
        ...state,
        openModal: true,
        treeviewAction: action.action,
      }
    /*
      NODES ACTIONS
      */
    case ADD_NODES:
      const nodes = nodeBuilder
        .addRootNode(getDsTitle(state))
        .addNodes(action.value, getDsTitle(state))
        .build()
      return { ...state, nodes }
    case ADD_PACKAGE:
      return {
        ...state,
        openModal: false,
        treeviewAction: '',
        nodes: nodeBuilder
          .createPackage(action.value, getDsTitle(state))
          .build(),
      }
    case ADD_FILE:
      return {
        ...state,
        openModal: false,
        treeviewAction: '',
        nodes: nodeBuilder.createFile(action.value, getDsTitle(state)).build(),
      }

    // FORM ACTIONS
    case EDIT_FILE:
      return { ...state, pageMode: PageMode.edit }
    case VIEW_FILE:
      return {
        ...state,
        dataUrl: generateDataUrl(state, action.value),
        pageMode: PageMode.view,
      }
    case CREATE_BLUEPRINT:
      return {
        ...state,
        pageMode: PageMode.create,
        dataUrl: generateDataUrl(state, action.value),
      }

    // TREEVIEW ACTIONS
    case FILTER_TREE:
    case TOGGLE_NODE:
      const treeNodes = TreeReducer(state.nodes, action)
      return { ...state, nodes: { ...treeNodes } }
    default:
      return state
  }
}

/**
 * Prefix a path with datasource title.
 * The datasource title is rootnodes and makes all nodes unique.
 * Any blueprint/entity/template should be reused between datasources.
 * @param state
 */
function getDatasourceSubPath(state: any) {
  // uncomment when endpoint /api/blueprints/ is updated.
  // return '/' + state.datasources[state.selectedDatasourceId].title
  return ''
}

/**
 * Prefix template url with datasource title.
 * @param state
 */
function generateTemplateUrl(state: BlueprintState) {
  //@todo support other templates, package.json, subpackage.json, datasources
  return `/api${getDatasourceSubPath(state)}/templates/blueprint.json`
}

/**
 *
 * @param state
 * @param selectedBlueprintId
 * returns url of a blueprint to put or fetch.
 */
function generateDataUrl(
  state: BlueprintState,
  selectedBlueprintId: string
): string {
  //strip datasource from selectedBlueprintId.
  const path = selectedBlueprintId.substr(selectedBlueprintId.indexOf('/'))
  return `/api${getDatasourceSubPath(state)}/blueprints${path}`
}

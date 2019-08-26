import { GenerateTreeview } from '../../util/generateTreeview'

const VIEW_FILE = 'VIEW_FILE'
const EDIT_FILE = 'EDIT_FILE'
const ADD_NODES = 'ADD_NODES'
const SET_SELECTED_DATASOURCE_ID = 'SET_SELECTED_DATASOURCE_ID'
const ADD_DATASOURCES = 'ADD_DATASOURCES'

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
  selectedDatasourceId: string
  selectedBlueprintId: string
  datasources: Datasource[]
  pageMode: PageMode
  templateUrl: string
  dataUrl: string
}

export const blueprintInitialState: BlueprintState = {
  selectedDatasourceId: '',
  selectedBlueprintId: '',
  datasources: [],
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

  addDatasources: (value: any[]): object => ({
    type: ADD_DATASOURCES,
    value,
  }),
  /**
   * Sets selectedBlueprintId and correct pageMode
   * @param id nodeId of file
   */
  viewFile: (id: string): BlueprintAction => ({
    type: VIEW_FILE,
    value: id,
  }),
  /**
   * Sets correct pageMode.
   */
  editFile: () => ({ type: EDIT_FILE }),
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
    case ADD_DATASOURCES:
      return {
        ...state,
        datasources: action.value,
        selectedDatasourceId:
          action.value && action.value.length && action.value[0]._id,
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

    default:
      return state
  }
}

/**
 * Prefix a nodeId with datasource title.
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

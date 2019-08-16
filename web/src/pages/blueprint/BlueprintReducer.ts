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
  { id: 0, label: 'Demo Blueprints' },
  { id: -1, label: 'Equinor Blueprints' },
]

export const blueprintInitialState: BlueprintState = {
  selectedDatasourceId: 0,
  selectedBlueprintId: '',
  datasources: datasources,
  openModal: false,
  treeviewAction: 'clear',
  pageMode: PageMode.view,
  templateUrl: '/api/blueprints/blueprint.json',
  dataUrl: `/api/blueprints/`,
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
}

export default (state: BlueprintState, action: BlueprintAction) => {
  switch (action.type) {
    case SET_SELECTED_DATASOURCE_ID:
      return {
        ...state,
        selectedDatasource: action.value,
        templateUrl: generateTemplateUrl(state),
        dataUrl: generateDataUrl(state, ''),
      }
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

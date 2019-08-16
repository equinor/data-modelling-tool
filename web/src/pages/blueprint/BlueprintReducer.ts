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
}

export const blueprintInitialState: BlueprintState = {
  selectedDatasourceId: 0,
  selectedBlueprintId: '',
  datasources: [
    { id: 0, label: 'Demo Blueprints' },
    { id: -1, label: 'Equinor Blueprints' },
  ],
  openModal: false,
  treeviewAction: 'clear',
  pageMode: PageMode.view,
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
      return { ...state, selectedDatasource: action.value }
    case SET_SELECTED_BLUEPRINT_ID:
      return { ...state, selectedBlueprintId: action.value }
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

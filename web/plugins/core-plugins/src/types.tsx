export interface DmtPlugin {
  pluginType: DmtPluginType
  pluginName: string
  content: any
}

export interface LoadedPlugin {
  plugins: DmtPlugin[]
}

export interface DmtUIPlugin {
  type: string
  dataSourceId: string
  documentId: string
  explorer: any
  uiRecipeName: any
  useIndex: any
  onSubmit: any
  document: any
  updateDocument: any
}

export enum DmtPluginType {
  UI,
  PAGE,
}

export interface DmtSettings {
  name: string
  label: string
  tabIndex: number
  hidden: boolean
  visibleDataSources: any
  type: string
  description: string
  packages: any
  models: any
  actions: any
  file_loc: string
  data_source_aliases: any
}

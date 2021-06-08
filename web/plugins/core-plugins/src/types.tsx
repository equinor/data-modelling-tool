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
}

export enum DmtPluginType {
  UI,
}

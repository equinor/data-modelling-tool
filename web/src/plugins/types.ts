export type BlueprintAttribute = {
  name: string
  type: string
  description?: string
  optional?: boolean
  contained?: boolean
  default?: string
  dimensions?: string
}

export type Blueprint = {
  name: string
  type: string
  description: string
  attributes: BlueprintAttribute[]
  uiRecipes: any[]
}

export type PluginImport = {
  name: string
  type: string
  description?: string
  parent: Blueprint
  blueprint: Blueprint
  children: Blueprint[]
  inPlace: boolean
}

export type PluginProps = {
  data?: PluginImport
  onSubmit?: Function
}

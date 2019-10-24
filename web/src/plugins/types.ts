export type BlueprintAttribute = {
  name: string
  type: string
  description?: string
  optional?: boolean
  contained?: boolean
  defaultValue?: string
  dimensions?: string
  value?: string
}

export type Blueprint = {
  name: string
  type: string
  description: string
  attributes: BlueprintAttribute[]
  uiRecipes: any[]
  storageRecipes: any[]
}

export type PluginProps = {
  name: string
  parent: Blueprint
  blueprint: Blueprint
  children: Blueprint[]
}

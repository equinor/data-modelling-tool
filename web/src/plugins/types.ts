export type BlueprintAttribute = {
  name: string
  type: string
  description?: string
  optional?: boolean
  contained?: boolean
  enumType?: string
  default?: string | boolean | number
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
  blueprint: Blueprint
  document: Blueprint
  blueprints: Blueprint[]
}

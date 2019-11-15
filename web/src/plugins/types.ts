export type BlueprintAttribute = {
  name: string
  type: string
  description?: string
  optional?: boolean
  contained?: boolean
  enumType?: string
  default?: string
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

// based on plugin blueprints
export type UiRecipe = {
  name: string
  plugin: string
  attributes: BlueprintAttribute[] //@todo use UiAttribute
}

export type PluginProps = {
  uiRecipe: UiRecipe //tab name, righthand side content
  blueprint: Blueprint
  document: Blueprint
  blueprints: Blueprint[]
}

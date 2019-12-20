export type BlueprintAttributeType = {
  name: string
  type: string
  description?: string
  label?: string
  optional?: boolean
  contained?: boolean
  enumType?: string
  default?: string
  dimensions?: string
  value?: string
}

type BaseBlueprint = {
  name: string
  type: string
  description: string
}

export interface BlueprintType extends BaseBlueprint {
  attributes: BlueprintAttributeType[]
  uiRecipes: any[]
  storageRecipes?: any[]
}

export interface Entity extends BaseBlueprint {
  [key: string]: any //entities can have any key - value pair.
}

export type PluginProps = {
  uiRecipe: UiRecipe //tab name, righthand side content
  blueprintType: BlueprintType
  document: Entity
  blueprintTypes: BlueprintType[]
  dtos: Dto[]
}

export type UiRecipe = {
  name: string
  type: string
  description?: string
  plugin: string
  hideTab?: boolean
  attributes: any[]
}

export interface DocumentData extends BaseBlueprint {
  attributes?: BlueprintAttributeType[]
  [key: string]: any //entities can have any key - value pair.
}

export type Dto = {
  uid: string
  data: DocumentData
}

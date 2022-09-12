export type TAttributeType = {
  type: string
  name: string
  attributeType?: string
  description?: string
  label?: string
  optional?: boolean
  contained?: boolean
  enumType?: string
  default?: string
  dimensions?: string
  value?: string
}

export type TBaseBlueprint = {
  name: string
  type: string
}

export interface IBlueprintType extends TBaseBlueprint {
  abstract: boolean
  description: string
  attributes: TAttributeType[]
  uiRecipes?: any[]
  storageRecipes?: any[]
}

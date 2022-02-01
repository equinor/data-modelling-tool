export type AttributeType = {
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

export type BaseBlueprint = {
  name: string
  type: string
}

export interface BlueprintType extends BaseBlueprint {
  abstract: boolean
  description: string
  attributes: AttributeType[]
  uiRecipes?: any[]
  storageRecipes?: any[]
}

export type TAttribute = {
  type: string
  name: string
  dimensions: string
  attributeType: string
  optional: boolean
  contained: boolean
  description?: string
  label?: string
  enumType?: string
  default?: string
}

export type TBlueprint = {
  name: string
  type: string
  description: string
  attributes: TAttribute[]
  uiRecipes?: any[]
  storageRecipes?: any[]
}

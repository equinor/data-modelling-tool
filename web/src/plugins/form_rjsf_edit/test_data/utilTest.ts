import { Blueprint, BlueprintAttribute } from '../../types'

export function createBlueprint(
  name: string,
  type: string,
  attributes: BlueprintAttribute[]
): Blueprint {
  return {
    description: '',
    name,
    type,
    attributes: attributes,
    uiRecipes: [],
    storageRecipes: [],
  }
}

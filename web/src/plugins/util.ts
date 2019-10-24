import { Blueprint } from './types'

/**
 * Utility function for working with blueprints and recipes.
 *
 */

export function findRecipe(blueprint: Blueprint, uiRecipePlugin: string) {
  return blueprint.uiRecipes.find(
    (recipe: any) => recipe.plugin === uiRecipePlugin
  )
}

export function findUiAttribute(uiRecipe: any, name: string) {
  return uiRecipe.attributes.find(
    (uiAttribute: any) => uiAttribute.name === name
  )
}

export function getBlueprintFromType(
  children: Blueprint[],
  attributeType: string
): Blueprint | undefined {
  return children.find((child: any) => {
    //@todo fix this.
    const attributeNameSplit = attributeType.split('/')
    const attributeName = attributeNameSplit[attributeNameSplit.length - 1]
    return child.name === attributeName
  })
}

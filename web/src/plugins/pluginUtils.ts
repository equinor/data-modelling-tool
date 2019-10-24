import { Blueprint, BlueprintAttribute } from './types'

/**
 * Utility function for working with blueprints and recipes.
 *
 */

//todo use attribute_type blueprint.
export function isPrimitive(type: string): boolean {
  return ['string', 'number', 'integer', 'number', 'boolean'].includes(type)
}

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

/**
 * Should be a blueprint for application wide defaults on the enum AttributeTypes.
 * To avoid specifying default in every blueprint that's created, define generic defaults.
 *
 * @param attribute
 */
export function getDefaults(attribute: BlueprintAttribute) {
  if (isPrimitive(attribute.type)) {
    switch (attribute.type) {
      case 'string':
        return ''
      case 'number':
        return 0
      case 'boolean':
        return false
      case 'integer':
        return 0
    }
  } else {
    return attribute.dimensions === '*' ? [] : {}
  }
}

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

export function findUiAttribute(uiRecipe: any, name: string): any {
  if (uiRecipe) {
    return uiRecipe.attributes.find(
      (uiAttribute: any) => uiAttribute.name === name
    )
  }
  return {}
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
  switch (attribute.type) {
    case 'string':
      return ''
    case 'number':
      return 0
    case 'boolean':
      return false
    case 'integer':
      return 0
    default:
      //type is a blueprint.
      return attribute.dimensions === '*' ? [] : {}
  }
}

/**
 * Parse attribute default values.
 * Since default is of type string, we can't store json type array, object, number or boolean.
 * These needs to be parsed from the blueprint
 *
 * @param attribute
 */
export function parseAttributeDefault(
  attribute: BlueprintAttribute
): BlueprintAttribute {
  if (typeof attribute.defaultValue === 'string') {
    if (attribute.type === 'boolean' && attribute.defaultValue !== undefined) {
      ;(attribute as any).defaultValue =
        attribute.defaultValue.toLowerCase() === 'false' ? false : true
    }
    //@todo add other default types.
  } else {
    console.warn(
      `attribute default value is incorrect. ${JSON.stringify(
        attribute,
        null,
        2
      )}`
    )
  }
  return attribute
}

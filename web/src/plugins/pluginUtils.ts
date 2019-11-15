import { Blueprint, BlueprintAttribute, PluginProps } from './types'

/**
 * Utility function for working with blueprints and recipes.
 *
 */

//todo use attribute_type blueprint.
export function isPrimitive(type: string): boolean {
  return ['string', 'number', 'integer', 'number', 'boolean'].includes(type)
}

export function findRecipe(blueprint: Blueprint, uiRecipePlugin: string): any {
  if (blueprint.uiRecipes) {
    return blueprint.uiRecipes.find(
      (recipe: any) => recipe.plugin === uiRecipePlugin
    )
  }
  return {}
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
 * Parse attribute default values.
 * Since default is of type string, we can't store json type array, object, number or boolean.
 * These needs to be parsed from the blueprint
 *
 * @param attribute
 */
export function parseAttributeDefault(
  attribute: BlueprintAttribute
): BlueprintAttribute {
  if (typeof attribute.default === undefined) {
    return attribute
  }
  if (typeof attribute.default === 'string') {
    if (attribute.type === 'boolean' && attribute.default !== undefined) {
      ;(attribute as any).default =
        attribute.default.toLowerCase() === 'false' ? false : true
    }
    if (attribute.type === 'integer' && attribute.default !== undefined) {
      ;(attribute as any).default = Number(attribute.default)
    }
    if (attribute.type === 'number' && attribute.default !== undefined) {
      ;(attribute as any).default = Number(attribute.default)
    }
    //@todo add other default types.
  } else {
    // console.warn(
    //   `attribute default value is incorrect. ${JSON.stringify(
    //     attribute,
    //     null,
    //     2
    //   )}`
    // )
  }
  return attribute
}

export function filterUiNotContained(uiRecipeParent: Blueprint) {
  return (parentAttribute: BlueprintAttribute) => {
    const uiAttribute = findUiAttribute(uiRecipeParent, parentAttribute.name)
    if (uiAttribute) {
      return uiAttribute.contained !== false
    }
    return true
  }
}

type TypeAndRecipe = {
  uiRecipe: any
  uiAttributeType: Blueprint | undefined
}
/**
 *
 * @param pluginProps
 */
export function setupTypeAndRecipe(pluginProps?: PluginProps): TypeAndRecipe {
  const widget = 'attribute'
  const empty = { uiRecipe: {}, uiAttributeType: undefined }
  if (!pluginProps) {
    return empty
  }
  const { blueprint, blueprints, uiRecipe } = pluginProps
  let uiAttributeType: any = {}

  if (!uiRecipe) {
    return empty
  }
  const uiAttributes = uiRecipe.attributes.filter(
    (uiAttribute: any) => uiAttribute.field === widget
  )
  if (uiAttributes.length > 0) {
    const uiAttribute = uiAttributes[0]
    // find attribute which is using the field property in uiAttribute.
    const parentAttribute = blueprint.attributes.find(
      (attribute: BlueprintAttribute) => {
        return attribute.name === uiAttribute.name
      }
    )
    if (parentAttribute && !isPrimitive(parentAttribute.type)) {
      uiAttributeType = getBlueprintFromType(blueprints, parentAttribute.type)
    } else {
    }
  }
  return { uiRecipe, uiAttributeType }
}

import { BlueprintAttribute, PluginProps, UiRecipe } from './types'
import { Blueprint } from './Blueprint'

/**
 * Utility function for working with blueprints and recipes.
 *
 */

//todo use attribute_type blueprint.
export function isPrimitive(type: string): boolean {
  return ['string', 'number', 'integer', 'number', 'boolean'].includes(type)
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

export function getPropsByAttribute(
  props: PluginProps,
  attribute: string,
  uiRecipe: UiRecipe
): PluginProps | undefined {
  const attributeKeys = attribute.split('.')
  if (attributeKeys.length === 0) {
    return props
  }
  const attributeName = attributeKeys[0]
  const attributeIndex = attributeKeys[1]
  const blueprint = new Blueprint(props.blueprint)
  const blueprintAttr = blueprint.getAttribute(attributeName)
  if (blueprintAttr) {
    if (
      !blueprint.isPrimitive(blueprintAttr.type) &&
      blueprint.isArray(blueprintAttr)
    ) {
      const nameFromTypeSplit = blueprintAttr.type.split('/')
      const name = nameFromTypeSplit[nameFromTypeSplit.length - 1]
      const nestedBlueprint = props.blueprints.find(bp => bp.name === name)
      if (nestedBlueprint) {
        return {
          blueprint: nestedBlueprint,
          uiRecipe:
            nestedBlueprint.uiRecipes.find(
              (recipe: UiRecipe) => recipe.name === uiRecipe.name
            ) || uiRecipe,
          blueprints: props.blueprints,
          document: ((props.document as any)[attributeName] as any)[
            attributeIndex
          ],
          dtos: props.dtos,
        }
      }
    }
  }
  return props
}

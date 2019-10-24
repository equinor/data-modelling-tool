import { Blueprint, BlueprintAttribute } from '../../types'
import { findRecipe, findUiAttribute } from '../../util'

type UiSchemaProperty = {
  items?: any
  'ui:widget'?: string
  'ui:field'?: string
  'ui:ArrayAttribute'?: any
}

/**
 * Adapter for blueprint to rsjf uiSchema.
 * https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/about-the-schema-and-uischema-objects/
 *
 * @param blueprint
 * @param parentAttribute
 * @param uiPluginName
 */
export function generateUiSchema(
  blueprint: Blueprint,
  parentAttribute: BlueprintAttribute,
  uiPluginName: string
) {
  const uiRecipe = findRecipe(blueprint, uiPluginName)
  const uiSchema = {}

  if (uiRecipe) {
    const uiAttribute = findUiAttribute(uiRecipe, parentAttribute.name)
    if (uiAttribute) {
      let property = createUiSchemaProperty(uiAttribute, parentAttribute)

      if (Object.keys(property).length > 0) {
        ;(uiSchema as any)[parentAttribute.name] = property
      }
    }
  }
  return {
    type: 'object',
    ...uiSchema,
  }
}

function createUiSchemaProperty(
  uiAttribute: any,
  blueprintAttribute: BlueprintAttribute
) {
  if (uiAttribute.contained === false) {
    return { 'ui:field': 'hidden' }
  }

  const property: UiSchemaProperty = {}

  if (uiAttribute.widget) {
    property['ui:widget'] = uiAttribute.widget
  }
  if (uiAttribute.field) {
    if (blueprintAttribute.dimensions === '*') {
      property.items = {
        'ui:field': uiAttribute.field,
      }
    } else {
      property['ui:field'] = uiAttribute.field
    }
  }
  return property
}

import { Blueprint, BlueprintAttribute } from '../../types'
import { findRecipe, findUiAttribute } from '../../pluginUtils'

type UiSchemaProperty = {
  items?: any
  'ui:widget'?: string
  'ui:field'?: string
  'ui:ArrayAttribute'?: any
}

export function generateUiSchema(parent: Blueprint, uiRecipe: any) {
  const uiSchema = {}
  if (uiRecipe) {
    parent.attributes.forEach((parentAttribute: BlueprintAttribute) => {
      const uiAttribute = findUiAttribute(uiRecipe, parentAttribute.name)
      if (uiAttribute) {
        let property = createUiSchemaProperty(uiAttribute, parentAttribute)

        if (Object.keys(property).length > 0) {
          ;(uiSchema as any)[parentAttribute.name] = property
        }
      }
    })
  }
  return {
    type: 'object',
    ...uiSchema,
  }
}

/**
 * Adapter for blueprint to rsjf uiSchema.
 * https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/about-the-schema-and-uischema-objects/
 *
 * @param blueprint
 * @param parentAttribute
 * @param uiRecipe
 */
export function generateUiSchemaByProperty(
  parent: Blueprint,
  parentAttribute: BlueprintAttribute,
  uiRecipe: any
) {
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

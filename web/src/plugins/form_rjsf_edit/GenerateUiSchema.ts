import { Blueprint, BlueprintAttribute, PluginProps } from '../types'
import { findUiAttribute } from '../pluginUtils'
import { getWidgetBlueprint } from './EditForm'

type UiSchemaProperty = {
  items?: any
  'ui:widget'?: string
  'ui:field'?: string
  'ui:ArrayAttribute'?: any
}

/**
 * Adapter for document to rsjf uiSchema.
 * https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/about-the-schema-and-uischema-objects/
 *
 * @param document
 * @param parentAttribute
 * @param uiRecipe
 */
export function generateUiSchema(pluginProps: PluginProps, uiRecipe: any) {
  const uiSchema = {}
  if (uiRecipe) {
    pluginProps.blueprint.attributes.forEach(
      (parentAttribute: BlueprintAttribute) => {
        const uiAttribute = findUiAttribute(uiRecipe, parentAttribute.name)
        if (uiAttribute) {
          let property = createUiSchemaProperty(
            uiAttribute,
            parentAttribute,
            pluginProps
          )

          if (Object.keys(property).length > 0) {
            ;(uiSchema as any)[parentAttribute.name] = property
          }
        }
      }
    )
  }
  return uiSchema
}

function createUiSchemaProperty(
  uiAttribute: any,
  blueprintAttribute: BlueprintAttribute,
  pluginProps: PluginProps
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
      const widgetBlueprint: Blueprint | null = getWidgetBlueprint(pluginProps)
      if (widgetBlueprint) {
        property.items = {
          'ui:field': uiAttribute.field,
          attributes: widgetBlueprint.attributes,
          uiRecipe: widgetBlueprint.uiRecipes.find(
            (recipe: any) => recipe.plugin === pluginProps.name
          ),
        }
      }
    } else {
      property['ui:field'] = uiAttribute.field
    }
  }
  return property
}

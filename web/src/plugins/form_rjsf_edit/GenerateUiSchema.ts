import { Blueprint, BlueprintAttribute, PluginProps } from '../types'
import { getWidgetBlueprint } from './EditForm'
import { BlueprintUtil, KeyValue } from '../BlueprintUtil'
import { findRecipe } from '../pluginUtils'
import { RegisteredPlugins } from '../../pages/common/layout-components/DocumentComponent'

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

const defaults: KeyValue = {
  name: { 'ui:disabled': true },
  type: { 'ui:disabled': true },
  description: { 'ui:widget': 'textarea' },
}

function addDefaultUiProperties(container: KeyValue, attr: any) {
  const defaultUiProperty = defaults[attr.name]
  if (defaultUiProperty) {
    container[attr.name] = defaultUiProperty
  }
}

export function generateUiSchema(pluginProps: PluginProps) {
  const { blueprint, uiRecipe } = pluginProps
  const blueprintUtil = new BlueprintUtil(
    pluginProps.blueprint,
    uiRecipe.plugin
  )

  const uiSchema = {}
  blueprint.attributes.forEach((attr: BlueprintAttribute) => {
    const uiAttribute = blueprintUtil.getUiAttribute(attr.name, uiRecipe.plugin)

    // top level blueprint.
    addDefaultUiProperties(uiSchema, attr)

    if (uiAttribute) {
      let property = createUiSchemaProperty(uiAttribute, attr, pluginProps)

      if (Object.keys(property).length > 0) {
        ;(uiSchema as any)[attr.name] = property
      }
    }
  })
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
        const uiRecipe = findRecipe(
          widgetBlueprint,
          RegisteredPlugins.EDIT_PLUGIN
        )
        property.items = {
          'ui:field': uiAttribute.field,
          attributes: widgetBlueprint.attributes,
          uiAttributes: uiRecipe.attributes,
        }
      }
    } else {
      property['ui:field'] = uiAttribute.field
    }
  }
  return property
}

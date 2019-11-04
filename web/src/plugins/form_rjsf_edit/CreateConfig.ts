import {
  generateTemplate,
  generateTemplateByProperty,
} from './GenerateTemplate'
import { Blueprint, BlueprintAttribute, PluginProps } from '../types'
import {
  generateUiSchema,
  generateUiSchemaByProperty,
} from './GenerateUiSchema'
import { filterUiNotContained, getDefaults } from '../pluginUtils'

interface JsonSchema {
  type: string
  title?: string
}

export interface JsonSchemaObject extends JsonSchema {
  properties: any
}

export interface JsonSchemaArray extends JsonSchema {
  items: any
}

export type FormConfig = {
  data: any
  attribute?: BlueprintAttribute | null
  template: JsonSchema
  uiSchema: any
}

export function createFormConfigs(
  pluginProps: PluginProps,
  splitForms: boolean,
  uiRecipe: any
): FormConfig[] {
  const { blueprint, document, blueprints } = pluginProps
  const parentAttributes = blueprint.attributes.filter(
    filterUiNotContained(uiRecipe)
  )

  if (splitForms) {
    return parentAttributes.map((attribute: BlueprintAttribute) => {
      return {
        attribute,
        data: getDataByAttribute(document, attribute),
        template: generateTemplateByProperty(
          blueprint,
          blueprints,
          attribute.name
        ),
        uiSchema: generateUiSchemaByProperty(pluginProps, attribute, uiRecipe),
      }
    })
  }

  return [
    {
      attribute: null,
      data: setDefaults(blueprint, document),
      template: generateTemplate(blueprint.attributes, blueprints),
      uiSchema: generateUiSchema(pluginProps, uiRecipe),
    },
  ]
}

function getDataByAttribute(
  document: Blueprint,
  attribute: BlueprintAttribute
) {
  const defaultValue = attribute.default || getDefaults(attribute)
  return {
    [attribute.name]: (document as any)[attribute.name] || defaultValue,
  }
}

function setDefaults(parent: Blueprint, blueprint: Blueprint) {
  Object.keys((key: string) => {
    const value = (blueprint as any)[key]
    const parentAttribute = parent.attributes.find(
      (parentAttribute: BlueprintAttribute) => parentAttribute.name === key
    )
    if (!parentAttribute) {
      throw new Error('invalid blueprint')
    }
    if (!value) {
      ;(blueprint as any)[key] = getDefaults(parentAttribute)
    }
  })
  return blueprint
}

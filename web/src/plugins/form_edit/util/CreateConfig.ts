import {
  generateTemplate,
  generateTemplateByProperty,
} from './GenerateTemplate'
import { Blueprint, BlueprintAttribute, PluginProps } from '../../types'
import {
  generateUiSchema,
  generateUiSchemaByProperty,
} from './GenerateUiSchema'
import { filterUiNotContained, getDefaults } from '../../pluginUtils'

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
  pluginImport: PluginProps,
  splitForms: boolean,
  uiRecipe: any
): FormConfig[] {
  const { parent, blueprint, children } = pluginImport
  const parentAttributes = parent.attributes.filter(
    filterUiNotContained(uiRecipe)
  )

  if (splitForms) {
    return parentAttributes.map((attribute: BlueprintAttribute) => {
      return {
        attribute,
        data: getDataByAttribute(blueprint, attribute),
        template: generateTemplateByProperty(parent, children, attribute.name),
        uiSchema: generateUiSchemaByProperty(parent, attribute, uiRecipe),
      }
    })
  }

  return [
    {
      attribute: null,
      data: setDefaults(parent, blueprint),
      template: generateTemplate(parent.attributes, children),
      uiSchema: generateUiSchema(parent, uiRecipe),
    },
  ]
}

function getDataByAttribute(
  blueprint: Blueprint,
  attribute: BlueprintAttribute
) {
  const defaultValue = attribute.default || getDefaults(attribute)
  return {
    [attribute.name]: (blueprint as any)[attribute.name] || defaultValue,
  }
}

function setDefaults(parent: Blueprint, blueprint: Blueprint) {
  Object.keys((key: string) => {
    const value = (blueprint as any)[key]
    const parentAttribute = parent.attributes.find(
      (parentAttribute: BlueprintAttribute) => parentAttribute.name === key
    )
    if (!parentAttribute) {
      throw 'invalid blueprint'
    }
    if (!value) {
      ;(blueprint as any)[key] = getDefaults(parentAttribute)
    }
  })
  return blueprint
}

import { generateTemplate } from './GenerateTemplate'
import { BlueprintAttribute, PluginProps } from '../../types'
import { generateUiSchema } from './GenerateUiSchema'
import { getDefaults } from '../../pluginUtils'

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
  attribute: BlueprintAttribute
  template: JsonSchema
}

const filterNotContained = (attribute: BlueprintAttribute) =>
  attribute.contained !== false

export function createFormConfigs(pluginImport: PluginProps): FormConfig[] {
  const { parent, blueprint, children, name } = pluginImport
  return pluginImport.parent.attributes
    .filter(filterNotContained)
    .map((attribute: BlueprintAttribute) => {
      const defaultValue = attribute.default || getDefaults(attribute)
      return {
        attribute,
        data: {
          [attribute.name]: (blueprint as any)[attribute.name] || defaultValue,
        },
        template: generateTemplate(parent, children, attribute.name),
        uiSchema: generateUiSchema(parent, attribute, name),
      }
    })
}

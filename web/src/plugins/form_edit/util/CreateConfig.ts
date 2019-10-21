import { generateTemplate } from './GenerateTemplate'
import { BlueprintAttribute, PluginProps } from '../../types'
import { generateUiSchema } from './GenerateUiSchema'

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

export function createFormConfigs(pluginImport: PluginProps): FormConfig[] {
  const { parent, blueprint, children, name } = pluginImport
  return (
    pluginImport.parent.attributes
      // .filter((parentAttribute: BlueprintAttribute) => parentAttribute.name === 'attributes')
      .map((attribute: BlueprintAttribute) => {
        return {
          attribute,
          data: { [attribute.name]: (blueprint as any)[attribute.name] },
          template: generateTemplate(parent, children, attribute.name),
          uiSchema: generateUiSchema(parent, attribute, name),
        }
      })
  )
}

import { generateTemplate } from './GenerateTemplate'
import { PluginProps } from '../types'
import { generateUiSchema } from './GenerateUiSchema'

export type FormConfig = {
  data: any
  template: any
  uiSchema: any
}

export function createFormConfigs(
  pluginProps: PluginProps,
  uiRecipe: any
): FormConfig {
  const { blueprint, document, blueprints } = pluginProps
  return {
    data: document,
    template: generateTemplate(blueprint.attributes, blueprints),
    uiSchema: generateUiSchema(pluginProps, uiRecipe),
  }
}

import { generateTemplate } from './GenerateTemplate'
import { BlueprintAttribute, PluginProps } from '../types'
import { generateUiSchema } from './GenerateUiSchema'

export type FormConfig = {
  data: any
  template: any
  uiSchema: any
}

/**
 *
 * @param blueprinAttribute
 */
const defaultFilter = (uiRecipe: any) => {
  if (uiRecipe) {
    //@todo fix issue #355.
  }
  return (blueprinAttribute: BlueprintAttribute) => {
    if (blueprinAttribute.name === 'attributes') {
      return true
    }
    return blueprinAttribute.type.indexOf('/') === -1
  }
}

export function createFormConfigs(
  pluginProps: PluginProps,
  uiRecipe: any
): FormConfig {
  const { blueprint, document, blueprints } = pluginProps
  const attributes = blueprint.attributes.filter(defaultFilter(uiRecipe))
  return {
    data: document,
    template: generateTemplate(attributes, blueprints),
    uiSchema: generateUiSchema(pluginProps),
  }
}

import { generateTemplate } from './GenerateTemplate'
import { BlueprintAttribute, PluginProps } from '../types'
import { generateUiSchema } from './GenerateUiSchema'
import { BlueprintUtil } from '../BlueprintUtil'
import { UtilIndexPlugin } from '../UtilIndexPlugin'
import { isPrimitive } from '../pluginUtils'

export type FormConfig = {
  data: any
  template: any
  uiSchema: any
}

export function createFormConfigs(pluginProps: PluginProps): FormConfig {
  const { blueprint, document, blueprints } = pluginProps
  const indexRecipe = BlueprintUtil.findRecipe(blueprint.uiRecipes, 'INDEX')
  const editRecipe = BlueprintUtil.findRecipe(
    blueprint.uiRecipes,
    pluginProps.uiRecipe.name
  )

  const filter = filterAttributes({ indexRecipe, editRecipe })
  const attributes = blueprint.attributes.filter(filter)

  return {
    data: document,
    template: generateTemplate(attributes, blueprints),
    uiSchema: generateUiSchema(pluginProps),
  }
}

function filterAttributes({ indexRecipe, editRecipe }: any): any {
  return (attr: BlueprintAttribute) => {
    const editRecipeAttr = getAttributeFromRecipe({
      recipe: editRecipe,
      name: attr.name,
    })
    //use editRecipe contained if provided.
    if (editRecipeAttr && editRecipeAttr.contained !== undefined) {
      return editRecipeAttr.contained
    }

    // defaults by edit plugin.
    if (isPrimitive(attr.type) || attr.name === 'attributes') {
      return true
    }

    // keep opposite of index plugin.
    const filter = UtilIndexPlugin.filterByIndexPlugin(null, indexRecipe)
    const inIndex = filter(attr)
    return !inIndex
  }
}

function getAttributeFromRecipe({ recipe, name }: any): any {
  if (recipe && recipe.attributes) {
    return BlueprintUtil.getAttributeByName(recipe.attributes, name)
  }
}

import { BlueprintAttribute, PluginProps, UiRecipe } from '../types'
import { BlueprintUtil } from '../BlueprintUtil'
import { UtilIndexPlugin } from '../UtilIndexPlugin'
import { isPrimitive } from '../pluginUtils'
import { BlueprintProvider } from '../BlueprintProvider'
import { BlueprintUiSchema } from './BlueprintUiSchema'
import { BlueprintSchema } from './BlueprintSchema'
import { Blueprint, KeyValue } from '../Blueprint'
import { EditPluginProps } from './EditForm'

export type FormConfig = {
  data: any
  template: any
  uiSchema: any
}

export type IndexFilter = (attr: BlueprintAttribute) => boolean

export function createFormConfigs(pluginProps: EditPluginProps): FormConfig {
  const { document, blueprints, uiRecipe, dtos } = pluginProps
  const blueprintType = pluginProps.blueprint
  const indexRecipe = BlueprintUtil.findRecipe(blueprintType.uiRecipes, 'INDEX')

  const blueprint = new Blueprint(blueprintType)
  const filter = filterAttributes(blueprint, uiRecipe, indexRecipe)

  const blueprintProvider = new BlueprintProvider(blueprints, dtos)
  const blueprintSchema = new BlueprintSchema(
    blueprintType,
    blueprintProvider,
    uiRecipe,
    filter,
    pluginProps.rootDocument
  )
  const uiSchema = new BlueprintUiSchema(
    blueprintType,
    blueprintProvider,
    uiRecipe,
    filter
  ).getSchema()

  return {
    data: document,
    template: blueprintSchema.getSchema(),
    uiSchema,
  }
}

function filterAttributes(
  blueprint: Blueprint,
  uiRecipe: UiRecipe,
  indexRecipe: UiRecipe
): any {
  const editRecipeAttributes: KeyValue | undefined = blueprint.getUiAttributes(
    uiRecipe.name
  )
  return (attr: BlueprintAttribute) => {
    if (editRecipeAttributes) {
      const editRecipeAttr = editRecipeAttributes[attr.name]
      //use editRecipe contained if provided.
      if (editRecipeAttr && editRecipeAttr.contained !== undefined) {
        return editRecipeAttr.contained
      }
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

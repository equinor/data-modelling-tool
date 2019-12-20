import {
  BlueprintAttributeType,
  BlueprintType,
  KeyValue,
  UiRecipe,
} from '../../domain/types'
import { UtilIndexPlugin } from '../UtilIndexPlugin'
import { BlueprintProvider } from '../BlueprintProvider'
import { BlueprintUiSchema } from './BlueprintUiSchema'
import { BlueprintSchema } from './BlueprintSchema'
import { Blueprint } from '../../domain/Blueprint'
import { EditPluginProps } from './EditForm'
import { BlueprintAttribute } from '../../domain/BlueprintAttribute'

export type FormConfig = {
  data: any
  template: any
  uiSchema: any
}

export type IndexFilter = (attr: BlueprintAttributeType) => boolean

export function createFormConfigs(pluginProps: EditPluginProps): FormConfig {
  const { document, blueprintTypes, uiRecipe, dtos } = pluginProps
  const blueprintType = pluginProps.blueprintType
  const indexRecipe = BlueprintUtil.findRecipe(blueprintType.uiRecipes, 'INDEX')

  const blueprint = new Blueprint(blueprintType)
  const filter = filterAttributes(blueprint, uiRecipe, indexRecipe)

  const blueprintProvider = new BlueprintProvider(blueprintTypes, dtos)
  const blueprintSchema = new BlueprintSchema(
    blueprintType,
    document,
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
  return (attrType: BlueprintAttributeType) => {
    const attr = new BlueprintAttribute(attrType)
    if (editRecipeAttributes) {
      const editRecipeAttr = editRecipeAttributes[attr.getName()]
      //use editRecipe contained if provided.
      if (editRecipeAttr && editRecipeAttr.contained !== undefined) {
        return editRecipeAttr.contained
      }
    }

    // defaults by edit plugin.
    if (
      attr.isPrimitiveType(attrType.type) ||
      attr.getName() === 'attributes'
    ) {
      return true
    }

    // keep opposite of index plugin.
    const filter = UtilIndexPlugin.filterByIndexPlugin(null, indexRecipe)
    const inIndex = filter(attrType)
    return !inIndex
  }
}

class BlueprintUtil {
  private attributes: KeyValue = {}
  private uiRecipes: KeyValue = {}

  constructor(blueprintType: BlueprintType, pluginName: string) {
    this.addAttributes(this.attributes, blueprintType.attributes)

    blueprintType.uiRecipes
      .filter((recipe: any) => recipe.plugin === pluginName)
      .forEach((recipe: any) => {
        const pluginKey = recipe.plugin
        if (pluginKey) {
          this.uiRecipes[pluginKey] = {}
          if (recipe.attributes) {
            this.addAttributes(this.uiRecipes[pluginKey], recipe.attributes)
          }
        }
      })
  }

  private addAttributes(container: KeyValue, attributes: any[]): void {
    attributes.forEach((attr: any) => {
      container[attr.name] = attr
    })
  }

  public static findRecipe(recipes: any[], name: string): any {
    if (recipes) {
      return recipes.find((recipe: any) => recipe.name === name)
    }
  }
}

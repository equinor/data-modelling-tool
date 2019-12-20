import { BlueprintType } from './types'

export type KeyValue = {
  [key: string]: any
}

export class BlueprintUtil {
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

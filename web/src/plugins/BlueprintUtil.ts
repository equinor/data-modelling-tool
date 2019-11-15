import { Blueprint } from './types'

export type KeyValue = {
  [key: string]: any
}

export class BlueprintUtil {
  private attributes: KeyValue = {}
  private uiRecipes: KeyValue = {}

  constructor(blueprint: Blueprint, pluginName: string) {
    this.addAttributes(this.attributes, blueprint.attributes)

    blueprint.uiRecipes
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

  public getUiAttribute(name: string, pluginName: string): object | undefined {
    if (this.uiRecipes && this.uiRecipes[pluginName]) {
      return this.uiRecipes[pluginName][name]
    }
  }

  public static getAttributeByName(
    attributes: any,
    name: string
  ): KeyValue | undefined {
    if (attributes) {
      return attributes.find((attr: any) => attr.name === name)
    }
  }

  public static findRecipe(recipes: any[], pluginName: string): any {
    if (recipes) {
      return recipes.find((recipe: any) => recipe.plugin === pluginName)
    }
  }
}

import { BlueprintAttribute, Blueprint as BlueprintType } from './types'

export type KeyValue = {
  [key: string]: any
}

interface IBlueprint {
  getUiAttribute: (name: string, pluginName: string) => object | undefined
}

export class Blueprint implements IBlueprint {
  private attributes: KeyValue = {}
  private uiRecipes: KeyValue = {}
  private blueprintType: BlueprintType

  constructor(blueprint: BlueprintType) {
    this.blueprintType = blueprint
    this.addAttributes(this.attributes, blueprint.attributes)

    blueprint.uiRecipes.forEach((recipe: any) => {
      const name = recipe.name
      if (name) {
        this.uiRecipes[name] = {}
        if (recipe.attributes) {
          this.addAttributes(this.uiRecipes[name], recipe.attributes)
        }
      }
    })
  }

  private addAttributes(container: KeyValue, attributes: any[]): void {
    attributes.forEach((attr: any) => {
      container[attr.name] = attr
    })
  }

  public getUiAttribute(
    uiRecipeName: string,
    attributeName: string
  ): KeyValue | undefined {
    if (this.uiRecipes && this.uiRecipes[uiRecipeName]) {
      return this.uiRecipes[uiRecipeName][attributeName]
    }
  }

  // helper functions
  isArray(attr: BlueprintAttribute) {
    return attr.dimensions === '*'
  }

  public getBlueprintType(): BlueprintType {
    return this.blueprintType
  }

  public getAttribute(name: string): BlueprintAttribute | undefined {
    return this.attributes[name]
  }

  public getUiAttributes(uiRecipeName: string): KeyValue | undefined {
    return this.uiRecipes[uiRecipeName]
  }

  public getBlueprintType() {
    return this.blueprintType
  }

  isPrimitive(type: string): boolean {
    //todo use AttributeTypes enum, available in the blueprint.
    return ['string', 'number', 'integer', 'number', 'boolean'].includes(type)
  }
}

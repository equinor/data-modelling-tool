import { BlueprintAttributeType, BlueprintType, KeyValue } from './types'
import { BlueprintAttribute } from './BlueprintAttribute'

interface IBlueprint {
  getUiAttribute: (name: string, pluginName: string) => object | undefined
}

export class Blueprint implements IBlueprint {
  private attributes: KeyValue = {}
  private uiRecipes: KeyValue = {}
  private blueprintType: BlueprintType

  constructor(blueprintType: BlueprintType) {
    this.blueprintType = blueprintType
    this.addAttributes(this.attributes, blueprintType.attributes)

    blueprintType.uiRecipes.forEach((recipe: any) => {
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
    if (attributes) {
      attributes.forEach((attr: any) => {
        container[attr.name] = attr
      })
    }
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
  isArray(attr: BlueprintAttributeType) {
    return new BlueprintAttribute(attr).isArray()
  }

  public getBlueprintType(): BlueprintType {
    return this.blueprintType
  }

  public getAttribute(name: string): BlueprintAttributeType | undefined {
    return this.attributes[name]
  }

  public getUiAttributes(uiRecipeName: string): KeyValue | undefined {
    return this.uiRecipes[uiRecipeName]
  }

  isPrimitive(type: string): boolean {
    //todo use AttributeTypes enum, available in the blueprint.
    return ['string', 'number', 'integer', 'number', 'boolean'].includes(type)
  }

  public validateEntity(entity: KeyValue) {
    this.blueprintType.attributes.forEach(
      (attrType: BlueprintAttributeType) => {
        const attr = new BlueprintAttribute(attrType)
        const value = entity[attr.getName()]
        if (attrType.optional !== true) {
          if (attr.isPrimitive()) {
            if (attrType.default) {
              //todo insert default?  need to do casting.
            }
          } else {
            if (value === undefined && this.isArray(attrType)) {
              entity[attrType.name] = []
            }
          }

          // required
          if (!entity[attrType.name]) {
            console.warn(
              `non optional value is missing for ${attrType.name} of type ${attrType.type}, ${entity.type}`
            )
          }
        }
      }
    )
  }
}

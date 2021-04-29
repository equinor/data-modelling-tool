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

    if (blueprintType.uiRecipes) {
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
  }

  public getAttributes() {
    return this.attributes
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

  public getBlueprintAttribute(name: string): BlueprintAttribute | undefined {
    if (this.attributes[name]) {
      return new BlueprintAttribute(this.attributes[name])
    }
    return undefined
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

  /**
   * Index recipe is one to one to blueprints.
   * Not expecting a use case where multiple index recipes for one blueprint is needed.
   * (and complexity is likely to blow up, especially on the api)
   */
  private getIndexRecipeAttributes(): KeyValue | undefined {
    if (this.blueprintType.uiRecipes) {
      const indexRecipe = this.blueprintType.uiRecipes.find(
        (recipe) => recipe.plugin === 'INDEX'
      )
      if (indexRecipe) {
        return this.getUiAttributes(indexRecipe.name)
      }
    }
  }

  /**
   * Filter attributes by ui recipe.
   * The recipes are
   *
   * @param editRecipeName
   */
  public filterAttributesByUiRecipe(editRecipeName = '') {
    const indexAttributes = this.getIndexRecipeAttributes()
    const editAttributes = this.getUiAttributes(editRecipeName)
    return (attr: BlueprintAttribute) => {
      const indexAttribute = indexAttributes && indexAttributes[attr.getName()]
      const editAttribute = editAttributes && editAttributes[attr.getName()]
      /* default edit plugin behavior.
        const INDEX_PRIMITIVE_CONTAINED = false
        const INDEX_ARRAY_CONTAINED = true
        const INDEX_TYPE_CONTAINED = true
      * */
      if (attr.isPrimitive()) {
        return true
      }

      // keep if contained in edit recipe.
      if (editAttribute?.contained) {
        return true
      }

      // return opppsite of index recipe.
      if (indexAttribute?.contained !== undefined) {
        return !indexAttribute.contained
      }
      return false
    }
  }
}

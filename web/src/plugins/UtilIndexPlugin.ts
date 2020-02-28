import { UiRecipe } from '../domain/types'
import { BlueprintAttribute } from '../domain/BlueprintAttribute'

const INDEX_PRIMITIVE_CONTAINED = false
const INDEX_ARRAY_CONTAINED = true
const INDEX_TYPE_CONTAINED = true

export class UtilIndexPlugin {
  /**
   * Filter attributes contained in the index.
   *
   * @param blueprinAttribute
   */
  public static filterByIndexPlugin(
    indexPlugin: any,
    indexRecipe: UiRecipe | undefined
  ) {
    //@todo read defaults from indexPlugin.
    return (attrType: any) => {
      const attr = new BlueprintAttribute(attrType)
      if (indexRecipe && indexRecipe.attributes) {
        const indexAttribute: any = indexRecipe.attributes.find(
          (indexAttr: any) => indexAttr.name === attr.getName()
        )
        if (indexAttribute && indexAttribute.contained !== undefined) {
          // override defaults
          return indexAttribute.contained
        }
      }
      // index plugin defaults

      const isArray = new BlueprintAttribute(attrType).isArray()
      const isType = !attr.isPrimitive()

      if (!isType) {
        return INDEX_PRIMITIVE_CONTAINED
      } else {
        if (attrType.name === 'attributes') {
          return true
        } else if (isArray) {
          return INDEX_ARRAY_CONTAINED
        } else {
          return INDEX_TYPE_CONTAINED
        }
      }
    }
  }
}

import { KeyValue } from './BlueprintUtil'
import { isPrimitive } from './pluginUtils'
import { UiRecipe } from './types'
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
    return (attr: any) => {
      if (indexRecipe) {
        const indexAttribute: any = indexRecipe.attributes.find(
          (indexAttr: any) => indexAttr.name === attr.name
        )
        if (indexAttribute && indexAttribute.contained !== undefined) {
          // override defaults
          return indexAttribute.contained
        }
      }
      // index plugin defaults
      const isArray = new BlueprintAttribute(attr).isArray()
      const isType = !isPrimitive(attr.type)

      if (!isType) {
        return INDEX_PRIMITIVE_CONTAINED
      } else {
        if (attr.name === 'attributes') {
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

export function getAttributeByName(
  attributes: any,
  name: string
): KeyValue | undefined {
  if (attributes) {
    return attributes.find((attr: any) => attr.name === name)
  }
}

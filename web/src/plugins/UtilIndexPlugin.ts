import { KeyValue } from './BlueprintUtil'
import { isPrimitive } from './pluginUtils'

const INDEX_PRIMITIVE_CONTAINED = false
const INDEX_ARRAY_CONTAINED = true
const INDEX_TYPE_CONTAINED = false

export class UtilIndexPlugin {
  /**
   * Filter attributes contained in the index.
   *
   * @param blueprinAttribute
   */
  public static filterByIndexPlugin(
    indexPlugin: any,
    indexRecipe: KeyValue | undefined
  ) {
    indexRecipe = indexRecipe || {}
    //@todo read defaults from indexPlugin.
    return (attr: any) => {
      const indexAttribute: KeyValue | undefined =
        indexRecipe && indexRecipe[attr.name]

      // override defaults
      if (indexAttribute && indexAttribute.contained !== undefined) {
        // filter opposite of indexAttribute
        return indexAttribute.contained
      }
      // index plugin defaults
      const isArray = attr.dimensions === '*'
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

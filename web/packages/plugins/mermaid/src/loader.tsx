import { DmssAPI } from '@development-framework/dm-core'
import { TAttributeType, IBlueprintType } from './types'

export class Node {
  public attribute: TAttributeType
  public parent: any
  public children: any
  public entity: any
  public concrete: boolean

  constructor(entity: any) {
    this.attribute = {
      name: '',
      type: '',
    }
    this.parent = null
    this.entity = entity
    this.children = []
    this.concrete = false
  }

  addChild(node: Node) {
    node.parent = this
    this.children.push(node)
  }

  primitiveAttributes() {
    return this.entity ? primitiveAttributes(this.entity) : []
  }
}

// Iterate in pre-order depth-first search order (DFS)
export function* dfs(node: Node): any {
  yield node

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      yield* dfs(child)
    }
  }
}

const isPrimitive = (attribute: TAttributeType) => {
  if (attribute.attributeType) {
    return ['string', 'number', 'integer', 'number', 'boolean'].includes(
      attribute.attributeType
    )
  } else return false
}
const primitiveAttributes = (blueprint: IBlueprintType): TAttributeType[] =>
  blueprint.attributes.filter((attribute: TAttributeType) =>
    isPrimitive(attribute)
  )
const isNonPrimitive = (attribute: TAttributeType) => !isPrimitive(attribute)
const nonPrimitiveAttributes = (blueprint: IBlueprintType): TAttributeType[] =>
  blueprint.attributes.filter((attribute: TAttributeType) =>
    isNonPrimitive(attribute)
  )

const search = async (token: string, query: any) => {
  const dmssAPI = new DmssAPI(token)

  const response = await dmssAPI.search({
    dataSources: ['WorkflowDS'],
    body: query,
    sortByAttribute: 'name',
  })
  const result = response.data
  return Object.values(result)
}

export const loader = async (
  token: string,
  explorer: any,
  document: any
): Promise<Node> => {
  const node = new Node(document)
  await Promise.all(
    nonPrimitiveAttributes(document).map(async (attribute: TAttributeType) => {
      if (attribute['attributeType'] !== 'object') {
        const child: IBlueprintType = await explorer.blueprintGet(
          attribute['attributeType']
        ).data
        const childNode: Node = await loader(token, explorer, child)
        childNode.attribute = attribute
        childNode.entity = child
        // If the attribute is abstract, we need to search for concrete definitions.
        if (child['abstract']) {
          const concreteDefinitions: IBlueprintType[] = await search(token, {
            type: child['type'],
            extends: attribute['attributeType'],
          })
          await Promise.all(
            concreteDefinitions.map(
              async (concreteDefinition: IBlueprintType) => {
                const concertNode = await loader(
                  token,
                  explorer,
                  concreteDefinition
                )
                concertNode.concrete = true
                concertNode.attribute = attribute
                // Connect the concrete definition to the abstract definition,
                // so that we can draw the complete graph
                childNode.addChild(concertNode)
              }
            )
          )
        }
        node.addChild(childNode)
      }
    })
  )

  return node
}

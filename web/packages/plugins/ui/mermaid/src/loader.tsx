import { DmssAPI } from '@dmt/common'
import { AttributeType, BlueprintType } from './types'

export class Node {
  public attribute: AttributeType
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
export function* dfs(node: Node) {
  yield node

  if (Array.isArray(node.children)) {
    for (let child of node.children) {
      yield* dfs(child)
    }
  }
}

const isPrimitive = (attribute: AttributeType) =>
  ['string', 'number', 'integer', 'number', 'boolean'].includes(
    attribute.attributeType
  )
const primitiveAttributes = (blueprint: BlueprintType): AttributeType[] =>
  blueprint.attributes.filter((attribute: AttributeType) =>
    isPrimitive(attribute)
  )
const isNonPrimitive = (attribute: AttributeType) => !isPrimitive(attribute)
const nonPrimitiveAttributes = (blueprint: BlueprintType): AttributeType[] =>
  blueprint.attributes.filter((attribute: AttributeType) =>
    isNonPrimitive(attribute)
  )

const search = async (token: string, query: any) => {
  const dmssAPI = new DmssAPI(token)

  let result = await dmssAPI.searchDocuments({
    dataSourceId: 'WorkflowDS',
    body: query,
    sortByAttribute: 'name',
  })
  return Object.values(result)
}

export const loader = async (
  token: string,
  explorer: any,
  document: any
): Promise<Node> => {
  const node = new Node(document)
  await Promise.all(
    nonPrimitiveAttributes(document).map(async (attribute: AttributeType) => {
      const child: BlueprintType = await explorer.getBlueprint(
        attribute['attributeType']
      )
      let childNode: Node = await loader(token, explorer, child)
      childNode.attribute = attribute
      childNode.entity = child
      // If the attribute is abstract, we need to search for concrete definitions.
      if (child['abstract']) {
        const concreteDefinitions: BlueprintType[] = await search(token, {
          type: child['type'],
          extends: attribute['attributeType'],
        })
        await Promise.all(
          concreteDefinitions.map(async (concreteDefinition: BlueprintType) => {
            let concertNode = await loader(token, explorer, concreteDefinition)
            concertNode.concrete = true
            concertNode.attribute = attribute
            // Connect the concrete definition to the abstract definition,
            // so that we can draw the complete graph
            childNode.addChild(concertNode)
          })
        )
      }
      node.addChild(childNode)
    })
  )

  return node
}

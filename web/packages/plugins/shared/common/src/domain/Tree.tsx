import { DmssAPI, DmtAPI } from '../services'
import { BlueprintEnum } from '../utils/variables'
import { TAttribute, TBlueprint } from './types'
import { TReference } from '../types'

type TreeMap = {
  [nodeId: string]: TreeNode
}

const dataSourceAttribute: TAttribute = {
  attributeType: 'dataSource',
  name: 'dataSource',
  type: BlueprintEnum.ATTRIBUTE,
  contained: false,
  optional: false,
  dimensions: '',
}

const packageAttribute: TAttribute = {
  attributeType: BlueprintEnum.PACKAGE,
  name: 'package',
  type: BlueprintEnum.ATTRIBUTE,
  contained: false,
  optional: false,
  dimensions: '',
}

const createContainedChildren = (
  document: any,
  parentNode: TreeNode,
  blueprint: TBlueprint
): TreeMap => {
  const newChildren: TreeMap = {}
  Object.entries(document).forEach(([key, value]: [string, any]) => {
    let attribute = blueprint.attributes.find(
      (attr: TAttribute) => attr.name === key
    ) as TAttribute
    if (Array.isArray(document)) {
      // If the passed document was an array, use attribute from parent
      // @ts-ignore
      attribute = parentNode?.attribute
    }
    if (!attribute) return false // If no attribute, there likely where some invalid keys. Ignore those
    // Skip adding nodes for primitives
    if (!['string', 'number', 'boolean'].includes(attribute.attributeType)) {
      const childNodeId = `${parentNode.nodeId}.${key}`
      newChildren[childNodeId] = new TreeNode(
        parentNode.tree,
        childNodeId,
        parentNode.level + 1,
        value,
        attribute,
        parentNode,
        value?.name || key,
        false,
        false,
        false
      )
    }
  })

  return newChildren
}

const createFolderChildren = (document: any, parentNode: TreeNode): TreeMap => {
  const newChildren: TreeMap = {}
  document.content.forEach((ref: TReference) => {
    const newChildId = `${parentNode.dataSource}/${ref?._id}`
    newChildren[newChildId] = new TreeNode(
      parentNode.tree,
      newChildId,
      parentNode.level + 1,
      ref,
      {
        attributeType: ref.type,
        name: ref?.name || ref?._id,
        type: BlueprintEnum.ATTRIBUTE,
        contained: false,
        optional: false,
        dimensions: '',
      },
      parentNode
    )
  })
  return newChildren
}

export class TreeNode {
  tree: Tree
  type: string
  nodeId: string
  level: number
  dataSource: string
  children: TreeMap = {}
  attribute: TAttribute | undefined
  parent?: TreeNode
  isRoot?: boolean = false
  isDataSource?: boolean = false
  entity?: any
  name?: string
  expanded?: boolean = false
  message?: string = ''

  constructor(
    tree: Tree,
    nodeId: string,
    level: number = 0,
    entity: any = {},
    attribute: TAttribute | undefined,
    parent: TreeNode | undefined = undefined,
    name: string | undefined = undefined,
    isRoot = false,
    isDataSource = false,
    expanded = false
  ) {
    this.tree = tree
    this.nodeId = nodeId
    this.dataSource = nodeId.split('/', 1)[0]
    this.level = level
    this.parent = parent
    this.isRoot = isRoot
    this.isDataSource = isDataSource
    this.entity = entity
    this.name = name || entity?.name
    this.type = attribute?.attributeType || ''
    this.expanded = expanded
    this.attribute = attribute
  }

  collapse(node?: TreeNode): void {
    let _node = node || this
    _node.expanded = false
    for (const child of Object.values<TreeNode>(_node?.children || {})) {
      this.collapse(child)
    }
  }

  // Fetches the unresolved document of the node
  async fetch() {
    const [dataSourceId, documentId] = this.nodeId.split('/', 2)
    return this.tree.dmssApi
      .documentGetById({
        dataSourceId: dataSourceId,
        documentId: documentId,
        depth: 0,
      })
      .then((response: any) => response.data)
  }

  async expand() {
    if (this.type !== 'dataSource') {
      const [dataSourceId, documentId] = this.nodeId.split('/', 2)
      console.log(this.type)
      const parentBlueprint: TBlueprint = await this.tree.dmssApi
        .blueprintGet({ typeRef: this.type })
        .then((response: any) => response.data)
      return this.tree.dmssApi
        .documentGetById({
          dataSourceId: dataSourceId,
          documentId: documentId,
          depth: 0,
        })
        .then((response: any) => {
          const data = response.data
          if (data.type === BlueprintEnum.PACKAGE) {
            this.children = createFolderChildren(data, this)
          } else {
            this.children = createContainedChildren(data, this, parentBlueprint)
          }
          this.expanded = true
          if (this.tree.expand) {
            this.children
              // @ts-ignore
              .values()
              .forEach((child: TreeNode) => child.expand())
          }
        })
        .catch((error: Error) => {
          this.type = 'error'
          this.message = error.message
        })
    } else {
      // Expanding a dataSource node will not trigger a fetch request. Return an instantly resolved Promise
      return new Promise((resolve) => {
        resolve(null)
      })
    }
  }

  getPath(): string {
    let path = ''
    if (this.parent) {
      path = `${this.parent.getPath()}/`
    }
    return `${path}${this.name}`
  }

  pathFromRootPackage(): string {
    return this.getPath().split('/').splice(1).join('/')
  }

  remove(): void {
    delete this?.parent?.children[this.nodeId]
  }

  // Creates a new entity on DMSS of the given type and saves it to this package,
  // returns the entity's UUID
  async addEntity(type: string, name: string): Promise<string> {
    if (this.type !== BlueprintEnum.PACKAGE && !Array.isArray(this.entity)) {
      throw 'Entities can only be added to packages and lists'
    }
    let packageContent = ''
    if (this.type === BlueprintEnum.PACKAGE) packageContent = '.content'

    return this.tree.dmtApi.createEntity(type, name).then((newEntity: any) =>
      this.tree.dmssApi
        .explorerAdd({
          absoluteRef: `${this.nodeId}${packageContent}`,
          body: newEntity,
          updateUncontained: true,
        })
        .then((response: any) => response.data.uid)
    )
  }
}

export class Tree {
  index: TreeMap = {}
  dmssApi: DmssAPI
  dmtApi: DmtAPI
  dataSources
  expand: boolean

  constructor(token: string, dataSources: string[], expand = false) {
    this.dmssApi = new DmssAPI(token)
    this.dmtApi = new DmtAPI(token)
    this.dataSources = dataSources
    dataSources.forEach(
      (
        dataSourceId: string // Add the dataSources as the top-level nodes
      ) => {
        this.index[dataSourceId] = new TreeNode(
          this,
          dataSourceId,
          0,
          { name: dataSourceId, type: 'dataSource' },
          dataSourceAttribute,
          undefined,
          dataSourceId,
          false,
          true,
          true
        )
      }
    )
    this.expand = expand
  }

  async from(absoluteId: string, entity: any) {
    const attribute = {
      attributeType: entity.type,
      name: entity.name,
      type: BlueprintEnum.ATTRIBUTE,
      contained: false,
      optional: false,
      dimensions: '',
    }
    const root = new TreeNode( // Add the rootPackage nodes to the dataSource
      this,
      absoluteId,
      1,
      entity,
      attribute,
      undefined,
      entity.name,
      true,
      false,
      true
    )
    this.index[absoluteId] = root
    await root.expand()
  }

  async init() {
    await Promise.all(
      this.dataSources.map((dataSource: string) =>
        this.dmssApi
          .search({
            // Find all rootPackages in every dataSource
            body: { type: BlueprintEnum.PACKAGE, isRoot: 'true' },
            dataSources: [dataSource],
          })
          .then((response: any) => {
            Object.values(response.data).forEach((rootPackage: any) => {
              const rootPackageNode = new TreeNode( // Add the rootPackage nodes to the dataSource
                this,
                `${dataSource}/${rootPackage._id}`,
                1,
                rootPackage,
                packageAttribute,
                this.index[dataSource],
                rootPackage.name,
                true,
                false,
                false
              )
              const children: TreeMap = {}
              rootPackage?.content.forEach(
                (
                  ref: any // Add the rootPackages children
                ) => {
                  children[ref?._id] = new TreeNode(
                    this,
                    `${dataSource}/${ref?._id}`,
                    2,
                    ref,
                    packageAttribute,
                    rootPackageNode,
                    ref.name,
                    false,
                    false,
                    false
                  )
                  if (this.expand) {
                    children[ref?._id].expand()
                  }
                }
              )
              rootPackageNode.children = children
              this.index[dataSource].children[rootPackage._id] = rootPackageNode
            })
          })
          .catch((error: Error) => {
            // If the search fail, set the DataSource as an error node.
            console.error(error)
            this.index[dataSource].type = 'error'
            this.index[dataSource].message = error.message
          })
      )
    )
  }

  // "[Symbol.iterator]" is similar to "__next__" in a python class.
  // "*" describes a generator function
  // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
  *[Symbol.iterator]() {
    function* recursiveYieldChildren(node: TreeNode): any {
      yield node
      for (const child of Object.values<TreeNode>(node?.children || {})) {
        yield* recursiveYieldChildren(child)
      }
    }

    for (const node of Object.values<TreeNode>(this.index)) {
      yield* recursiveYieldChildren(node)
    }
  }
}

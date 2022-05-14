import { DmssAPI, DmtAPI } from '../services'
import { BlueprintEnum } from '../utils/variables'

type TreeMap = {
  [nodeId: string]: TreeNode
}

const createContainedChildren = (
  blueprint: any,
  document: any,
  parentNode: TreeNode
): TreeMap => {
  const newChildren: TreeMap = {}

  Object.entries(document).forEach(([key, value]: [string, any]) => {
    const attribute = blueprint.attributes.find(
      (attribute: any) => attribute.name === key
    )
    if (typeof value === 'object') {
      console.log(key, value.contained, attribute)
      const childNodeId = `${parentNode.nodeId}.${key}`
      newChildren[childNodeId] = new TreeNode(
        parentNode.tree,
        childNodeId,
        parentNode.level + 1,
        value,
        parentNode,
        value?.name || key,
        false,
        false,
        false,
        value.contained,
        key,
        attribute
      )
    }
    if (Array.isArray(value)) {
      const childNodeId = `${parentNode.nodeId}.${key}`
      newChildren[childNodeId] = new TreeNode(
        parentNode.tree,
        childNodeId,
        parentNode.level + 1,
        value,
        parentNode,
        key,
        false,
        false,
        false,
        attribute.contained,
        key,
        attribute
      )
    }
  })

  return newChildren
}

const createFolderChildren = (document: any, parentNode: TreeNode): TreeMap => {
  const newChildren: TreeMap = {}
  document.content.forEach((ref: any) => {
    const newChildId = `${parentNode.dataSource}/${ref?._id}`
    newChildren[newChildId] = new TreeNode(
      parentNode.tree,
      newChildId,
      parentNode.level + 1,
      ref,
      parentNode
    )
  })
  return newChildren
}

export class TreeNode {
  tree: Tree
  nodeId: string
  level: number
  parent?: TreeNode
  children: TreeMap = {}
  isRoot?: boolean = false
  isDataSource?: boolean = false
  entity?: any
  name?: string
  type: string
  attribute?: string
  expanded?: boolean = false
  message?: string = ''
  dataSource: string
  contained: boolean = true
  attributeData: any = {}

  constructor(
    tree: Tree,
    nodeId: string,
    level: number = 0,
    entity: any = {},
    parent: TreeNode | undefined = undefined,
    name: string | undefined = undefined,
    isRoot = false,
    isDataSource = false,
    expanded = false,
    contained = true,
    attribute = '',
    attributeData: any = {}
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
    this.type = entity.type
    this.expanded = expanded
    this.contained = contained
    this.attribute = attribute
    this.attributeData = attributeData
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
      return this.tree.dmssApi
        .documentGetById({
          dataSourceId: dataSourceId,
          documentId: documentId,
          depth: 0,
        })
        .then(async (response: any) => {
          const data = response.data
          await this.tree.dmssApi
            .blueprintGet({
              typeRef: Array.isArray(data) ? data[0].type : data.type,
            })
            .then((responseBlueprint: any) => {
              if (data.type === BlueprintEnum.PACKAGE) {
                this.children = createFolderChildren(data, this)
              } else {
                this.children = createContainedChildren(
                  responseBlueprint.data,
                  data,
                  this
                )
              }
              this.expanded = true
              if (this.tree.expand) {
                // @ts-ignore
                this.children
                  .values()
                  .forEach((child: TreeNode) => child.expand())
              }
            })
            .catch((error: Error) => {
              console.log(error)
            })
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
    if (this.type !== BlueprintEnum.PACKAGE)
      throw 'Entities can only be added to packages'

    return this.tree.dmtApi.createEntity(type, name).then((newEntity: any) => {
      return this.tree.dmssApi
        .explorerAddToPath({
          dataSourceId: this.dataSource,
          document: JSON.stringify(newEntity),
          directory: this.pathFromRootPackage(),
          updateUncontained: false,
        })
        .then((response: any) => response.data.uid)
    })
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
    const root = new TreeNode( // Add the rootPackage nodes to the dataSource
      this,
      absoluteId,
      1,
      entity,
      undefined,
      entity.name,
      true,
      false,
      false
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

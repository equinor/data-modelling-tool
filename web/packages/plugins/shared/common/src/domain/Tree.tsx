import { DmssAPI, DmtAPI } from '../services'
import { BlueprintEnum } from '../utils/variables'

type TreeMap = {
  [nodeId: string]: TreeNode
}

const createContainedChildren = (
  document: any,
  parentNode: TreeNode
): TreeMap => {
  const newChildren: TreeMap = {}
  Object.entries(document).forEach(([key, value]: [string, any]) => {
    if (typeof value === 'object') {
      const childNodeId = `${parentNode.nodeId}.${key}`
      newChildren[childNodeId] = new TreeNode(
        parentNode.tree,
        childNodeId,
        parentNode.level + 1,
        value,
        parentNode,
        value?.name || key
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
        key
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
  expanded?: boolean = false
  message?: string = ''
  dataSource: string

  constructor(
    tree: Tree,
    nodeId: string,
    level: number = 0,
    entity: any = {},
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
    this.type = entity.type
    this.expanded = expanded
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
      .getDocumentById({
        dataSourceId: dataSourceId,
        documentId: documentId,
        depth: 0,
      })
      .then((doc: any) => doc)
  }

  async expand() {
    this.expanded = true
    if (this.type !== 'dataSource') {
      const [dataSourceId, documentId] = this.nodeId.split('/', 2)
      return this.tree.dmssApi
        .getDocumentById({
          dataSourceId: dataSourceId,
          documentId: documentId,
          depth: 0,
        })
        .then((response: any) => {
          if (response.type === BlueprintEnum.PACKAGE) {
            this.children = createFolderChildren(response, this)
          } else {
            this.children = createContainedChildren(response, this)
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
    if (this.type !== BlueprintEnum.PACKAGE)
      throw 'Entities can only be added to packages'

    return this.tree.dmtApi.createEntity(type, name).then((newEntity: any) => {
      return this.tree.dmssApi.generatedDmssApi
        .explorerAddToPath({
          dataSourceId: this.dataSource,
          document: JSON.stringify(newEntity),
          directory: this.pathFromRootPackage(),
          updateUncontained: false,
        })
        .then((uuid: string) => JSON.parse(uuid).uid)
    })
  }
}

export class Tree {
  index: TreeMap = {}
  dmssApi: DmssAPI
  dmtApi: DmtAPI
  dataSources

  constructor(token: string, dataSources: string[]) {
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
  }

  async init() {
    await Promise.all(
      this.dataSources.map((dataSource: string) =>
        this.dmssApi
          .searchDocuments({
            // Find all rootPackages in every dataSource
            body: { type: BlueprintEnum.PACKAGE, isRoot: 'true' },
            dataSources: [dataSource],
          })
          .then((searchResult: Object) => {
            Object.values(searchResult).forEach((rootPackage: any) => {
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
                }
              )
              rootPackageNode.children = children
              this.index[dataSource].children[rootPackage._id] = rootPackageNode
            })
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

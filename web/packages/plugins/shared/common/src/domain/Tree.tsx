import { DmssAPI } from '../services'
import { BlueprintEnum } from '../utils/variables'

type TreeMap = {
  [nodeId: string]: SimpleTreeNode
}

export class SimpleTreeNode {
  tree: SimpleTree
  nodeId: string
  level: number
  parent?: SimpleTreeNode
  children: TreeMap = {}
  isRoot?: boolean = false
  isDataSource?: boolean = false
  entity?: any
  name?: string
  type?: string
  expanded?: boolean = false
  message?: string = ''

  constructor(
    tree: SimpleTree,
    nodeId: string,
    level: number = 0,
    entity: any = {},
    parent: SimpleTreeNode | undefined = undefined,
    isRoot = false,
    isDataSource = false,
    expanded = false
  ) {
    this.tree = tree
    this.nodeId = nodeId
    this.level = level
    this.parent = parent
    this.isRoot = isRoot
    this.isDataSource = isDataSource
    this.entity = entity
    this.name = entity?.name
    this.type = entity?.type
    this.expanded = expanded
  }

  collapse(node?: SimpleTreeNode): void {
    let _node = node || this
    _node.expanded = false
    for (const child of Object.values<SimpleTreeNode>(_node?.children || {})) {
      this.collapse(child)
    }
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
          const children: TreeMap = {}
          response?.content.forEach(
            (ref: any) =>
              (children[ref?._id] = new SimpleTreeNode(
                this.tree,
                `${dataSourceId}/${ref?._id}`,
                this.level + 1,
                ref,
                this
              ))
          )
          this.children = children
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
}

export class SimpleTree {
  index: TreeMap = {}
  dmssApi: DmssAPI
  dataSources

  constructor(token: string, dataSources: string[]) {
    this.dmssApi = new DmssAPI(token)
    this.dataSources = dataSources
    dataSources.forEach(
      (
        dataSourceId: string // Add the dataSources as the top-level nodes
      ) => {
        this.index[dataSourceId] = new SimpleTreeNode(
          this,
          dataSourceId,
          0,
          { name: dataSourceId, type: 'dataSource' },
          undefined,
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
              const rootPackageNode = new SimpleTreeNode( // Add the rootPackage nodes to the dataSource
                this,
                `${dataSource}/${rootPackage._id}`,
                1,
                rootPackage,
                this.index[dataSource],
                true,
                false,
                false
              )
              const children: TreeMap = {}
              rootPackage?.content.forEach(
                (
                  ref: any // Add the rootPackages children
                ) => {
                  children[ref?._id] = new SimpleTreeNode(
                    this,
                    `${dataSource}/${ref?._id}`,
                    2,
                    ref,
                    rootPackageNode,
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
    function* recursiveYieldChildren(node: SimpleTreeNode): any {
      yield node
      for (const child of Object.values<SimpleTreeNode>(node?.children || {})) {
        yield* recursiveYieldChildren(child)
      }
    }

    for (const node of Object.values<SimpleTreeNode>(this.index)) {
      yield* recursiveYieldChildren(node)
    }
  }
}

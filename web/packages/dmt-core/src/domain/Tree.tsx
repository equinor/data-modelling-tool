import { DmssAPI, DmtAPI } from '../services'
import { EBlueprint } from '../Enums'
import { TAttribute, TBlueprint } from './types'
import { TReference } from '../types'
import { AxiosResponse } from 'axios'

type TTreeMap = {
  [nodeId: string]: TreeNode
}

const dataSourceAttribute: TAttribute = {
  attributeType: 'dataSource',
  name: 'dataSource',
  type: EBlueprint.ATTRIBUTE,
  contained: false,
  optional: false,
  dimensions: '',
}

const packageAttribute: TAttribute = {
  attributeType: EBlueprint.PACKAGE,
  name: 'package',
  type: EBlueprint.ATTRIBUTE,
  contained: false,
  optional: false,
  dimensions: '',
}

const createContainedChildren = (
  document: any,
  parentNode: TreeNode,
  blueprint: TBlueprint
): TTreeMap => {
  const newChildren: TTreeMap = {}
  Object.entries(document).forEach(([key, value]: [string, any]) => {
    let attribute = blueprint.attributes.find(
      (attr: TAttribute) => attr.name === key
    ) as TAttribute
    if (Array.isArray(document)) {
      // If the passed document was an array, use attribute from parent
      attribute = parentNode.attribute
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
        // If this "new" node already exists on parent, instantiate the node with the same old children.
        // If not the tree will lose already loaded children whenever a node is expanded()
        parentNode.children?.[childNodeId]?.children || {}
      )
    }
  })

  return newChildren
}

const createFolderChildren = (
  document: any,
  parentNode: TreeNode
): TTreeMap => {
  const newChildren: TTreeMap = {}
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
        type: EBlueprint.ATTRIBUTE,
        contained: false,
        optional: false,
        dimensions: '',
      },
      parentNode,
      undefined,
      false,
      false,
      parentNode.children?.[newChildId]?.children || {}
    )
  })
  return newChildren
}

const updateRootPackagesInTree = (
  rootPackages: any,
  tree: Tree,
  dataSource: string
) => {
  // Update content in a datasource. Search the DMSS database for root packages in a given datasource
  // and update the tree only if any packages from DMSS is missing in the tree.

  Object.values(rootPackages).forEach((rootPackage: any) => {
    //Only update tree if package is missing.
    if (
      !Object.keys(tree.index[dataSource].children).includes(rootPackage['_id'])
    ) {
      const rootPackageNode = new TreeNode( // Add the rootPackage nodes to the dataSource
        tree,
        `${dataSource}/${rootPackage._id}`,
        1,
        rootPackage,
        packageAttribute,
        tree.index[dataSource],
        rootPackage.name,
        true,
        false
      )
      const children: TTreeMap = {}
      rootPackage?.content.forEach(
        (
          ref: any // Add the rootPackages children
        ) => {
          children[ref?._id] = new TreeNode(
            tree,
            `${dataSource}/${ref?._id}`,
            2,
            ref,
            packageAttribute,
            rootPackageNode,
            ref.name,
            false,
            false
          )
        }
      )
      rootPackageNode.children = children
      tree.index[dataSource].children[rootPackage._id] = rootPackageNode
    }
  })
}

export class TreeNode {
  tree: Tree
  type: string
  nodeId: string
  level: number
  dataSource: string
  children: TTreeMap = {}
  attribute: TAttribute
  parent?: TreeNode
  isRoot: boolean = false
  isDataSource: boolean = false
  entity?: any
  name?: string
  message: string = ''

  constructor(
    tree: Tree,
    nodeId: string,
    level: number = 0,
    entity: any = {},
    attribute: TAttribute,
    parent: TreeNode | undefined = undefined,
    name: string | undefined = undefined,
    isRoot = false,
    isDataSource = false,
    children: TTreeMap = {}
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
    this.type = Object.keys(entity).length
      ? entity.type
      : attribute.attributeType
    this.attribute = attribute
    this.children = children
  }

  *[Symbol.iterator]() {
    function* recursiveYieldChildren(node: TreeNode): any {
      yield node
      for (const child of Object.values<TreeNode>(node?.children || {})) {
        yield* recursiveYieldChildren(child)
      }
    }

    for (const node of Object.values<TreeNode>(Object.values(this.children))) {
      yield* recursiveYieldChildren(node)
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

  async expand(): Promise<void> {
    if (!this.isDataSource) {
      const [dataSourceId, documentId] = this.nodeId.split('/', 2)
      const parentBlueprint: TBlueprint = await this.tree.dmssApi
        .blueprintGet({ typeRef: this.type })
        .then((response: any) => response.data)
      this.tree.dmssApi
        .documentGetById({
          dataSourceId: dataSourceId,
          documentId: documentId,
          depth: 0,
        })
        .then((response: any) => {
          const data = response.data
          if (data.type === EBlueprint.PACKAGE) {
            this.children = createFolderChildren(data, this)
          } else {
            this.children = createContainedChildren(data, this, parentBlueprint)
          }
          this.tree.updateCallback(this.tree)
        })
        .catch((error: Error) => {
          this.type = 'error'
          this.message = error.message
        })
    } else {
      // Update content in a datasource. Search the DMSS database for root packages in a given datasource
      // and update the tree if any packages from DMSS is missing in the tree.
      await this.tree.dmssApi
        .search({
          body: { type: EBlueprint.PACKAGE, isRoot: 'true' },
          dataSources: [this.dataSource],
        })
        .then((response: any) => {
          updateRootPackagesInTree(response.data, this.tree, this.dataSource)
        })
        .catch((error: Error) => {
          // If the search fail, set the DataSource as an error node.
          console.error(error)
          this.tree.index[this.dataSource].type = 'error'
          this.tree.index[this.dataSource].message = error.message
        })
        .finally(() => {
          this.tree.updateCallback(this.tree)
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
    this.tree.updateCallback(this.tree)
  }

  // Creates a new entity on DMSS of the given type and saves it to this package,
  // returns the entity's UUID
  async addEntity(type: string, name: string): Promise<string> {
    if (this.type !== EBlueprint.PACKAGE && !Array.isArray(this.entity)) {
      throw 'Entities can only be added to packages and lists'
    }
    let packageContent = ''
    if (this.type === EBlueprint.PACKAGE) packageContent = '.content'

    const response = await this.tree.dmtApi.instantiateEntity({
      basicEntity: { name: name, type: type },
    })
    const newEntity = response.data
    const createResponse: AxiosResponse<any> = await this.tree.dmssApi.documentAdd(
      {
        absoluteRef: `${this.nodeId}${packageContent}`,
        body: newEntity,
        updateUncontained: true,
      }
    )
    await this.expand()
    return createResponse.data.uid
  }
}

export class Tree {
  index: TTreeMap = {}
  dmssApi: DmssAPI
  dmtApi: DmtAPI
  updateCallback: (t: Tree) => void

  constructor(token: string, updateCallback: (t: Tree) => void) {
    this.dmssApi = new DmssAPI(token)
    this.dmtApi = new DmtAPI(token)
    this.updateCallback = updateCallback
  }

  async initFromDataSources(dataSources: string[]) {
    // Add the dataSources as the top-level nodes
    dataSources.forEach((dataSourceId: string) => {
      this.index[dataSourceId] = new TreeNode(
        this,
        dataSourceId,
        0,
        { name: dataSourceId, type: 'dataSource' },
        dataSourceAttribute,
        undefined,
        dataSourceId,
        false,
        true
      )
    })
    await Promise.all(
      dataSources.map((dataSource: string) =>
        this.dmssApi
          .search({
            // Find all rootPackages in every dataSource
            body: { type: EBlueprint.PACKAGE, isRoot: 'true' },
            dataSources: [dataSource],
          })
          .then((response) => {
            updateRootPackagesInTree(response.data, this, dataSource)
          })
          .catch((error: Error) => {
            // If the search fail, set the DataSource as an error node.
            console.error(error)
            this.index[dataSource].type = 'error'
            this.index[dataSource].message = error.message
          })
      )
    ).then(() => this.updateCallback(this))
  }

  async initFromFolder(folderPath: string) {
    const [dataSourceId, ...pathArray] = folderPath.split('/')
    const path = pathArray.join('/')
    this.dmssApi
      .documentGetByPath({ dataSourceId: dataSourceId, path: path })
      .then((response: any) => {
        const data = response.data
        const folderNode = new TreeNode(
          this,
          `${dataSourceId}/${data._id}`,
          0,
          data,
          packageAttribute,
          undefined,
          data?.name || data._id,
          true,
          false
        )
        if (data.type !== EBlueprint.PACKAGE)
          throw new Error('Path does not resolve to a package')

        folderNode.children = createFolderChildren(data, folderNode)
        this.index = { [`${dataSourceId}/${data._id}`]: folderNode }
      })
      .catch((error: Error) => {
        const folderNode = new TreeNode(
          this,
          folderPath,
          0,
          {
            type: EBlueprint.PACKAGE,
            name: 'failed',
            description: error.message,
          },
          packageAttribute,
          undefined,
          'unknown',
          true,
          false
        )
        folderNode.type = 'error'
        folderNode.message = error.message
        this.index = { [folderPath]: folderNode }
      })
      .finally(() => this.updateCallback(this))
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

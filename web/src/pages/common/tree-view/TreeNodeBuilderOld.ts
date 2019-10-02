import { NodeIconType, TreeNodeData } from '../../../components/tree-view/Tree'
import { NodeType } from '../../../api/types'
import { IndexNode } from '../../../api/Api'

type IndexNodeV2 = {
  id: string
  filename: string
  nodeType: NodeType
  children?: string[]
  templateRef?: string
  meta?: object
}

export class TreeNodeBuilderOld {
  treeNode: TreeNodeData

  constructor(node: IndexNode) {
    this.treeNode = createTreeNode({
      id: node.id,
      filename: node.title,
      nodeType: node.nodeType,
      children: node.children,
      templateRef: node.templateRef,
      meta: node.meta,
    })
  }

  create(indexNodeV2: IndexNodeV2) {
    this.treeNode = createTreeNode(indexNodeV2)
    return this
  }

  setOpen(open: boolean): TreeNodeBuilderOld {
    this.treeNode.isOpen = open
    return this
  }

  build(): TreeNodeData {
    return this.treeNode
  }
}

function createTreeNode({
  id,
  filename,
  nodeType,
  children = [],
  templateRef = '',
  meta = {},
}: IndexNodeV2) {
  const folderNodes = [NodeType.rootPackage, NodeType.subPackage]
  if (children.length) {
    folderNodes.push(NodeType.entityFile)
  }
  return {
    nodeId: id,
    title: filename,
    templateRef,
    nodeType,
    meta,
    isExpandable: isExpandable(nodeType, children),
    isOpen: false,
    isRoot: nodeType === NodeType.datasource,
    isHidden: false,
    children: children || [],
    icon: getNodeIcon(nodeType),
    isFolder: folderNodes.includes(nodeType),
  }
}

export class TreeNodeBuilder extends TreeNodeBuilderOld {
  constructor(node: IndexNodeV2) {
    super({
      id: node.id,
      title: node.filename,
      nodeType: node.nodeType,
      children: node.children,
    })
  }
}

function getNodeIcon(nodeType: NodeType): NodeIconType {
  switch (nodeType) {
    case NodeType.datasource:
      return NodeIconType.database

    case NodeType.version:
    case NodeType.rootPackage:
    case NodeType.subPackage:
    case NodeType.folder:
    case NodeType.ARRAY_PLACEHOLDER:
      return NodeIconType.folder
    case NodeType.fileRef:
    case NodeType.file:
    case NodeType.entityFile:
      return NodeIconType.file
    case NodeType.documentRef:
      return NodeIconType.ref
    default:
      console.warn(`nodeType ${nodeType} is not matched to any icon type.`)
      return NodeIconType.default
  }
}

function isExpandable(nodeType: NodeType, children: string[]): boolean {
  switch (nodeType) {
    case NodeType.version:
    case NodeType.datasource:
    case NodeType.subPackage:
    case NodeType.rootPackage:
    case NodeType.folder:
    case NodeType.ARRAY_PLACEHOLDER:
      return true
    case NodeType.entityFile:
    case NodeType.documentRef:
      return children.length > 0
    default:
      // add special logic here if file should be expandable.
      return false
  }
}

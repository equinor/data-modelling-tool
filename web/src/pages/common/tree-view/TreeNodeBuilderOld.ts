import { NodeIconType, TreeNodeData } from '../../../components/tree-view/Tree'
import { NodeType } from '../../../api/types'
import { IndexNode } from '../../../api/Api'

type IndexNodeV2 = {
  id: string
  filename: string
  nodeType: NodeType
  children?: string[]
}

export class TreeNodeBuilderOld {
  treeNode: TreeNodeData

  constructor(node: IndexNode) {
    this.treeNode = createTreeNode({
      id: node.id,
      filename: node.title,
      nodeType: node.nodeType,
      children: node.children,
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

  build() {
    return this.treeNode
  }
}

function createTreeNode({ id, filename, nodeType, children }: IndexNodeV2) {
  return {
    nodeId: id,
    title: filename,
    nodeType,
    isExpandable: isExpandable(nodeType),
    isOpen: false,
    isRoot: nodeType === NodeType.datasource,
    isHidden: false,
    children: children || [],
    icon: getNodeIcon(nodeType),
    isFolder: [NodeType.rootPackage, NodeType.subPackage].includes(nodeType),
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

    case NodeType.rootPackage:
    case NodeType.subPackage:
      return NodeIconType.folder

    case NodeType.file:
      return NodeIconType.file
    default:
      console.warn(`nodeType ${nodeType} is not matched to any icon type.`)
      return NodeIconType.default
  }
}

function isExpandable(nodeType: NodeType) {
  switch (nodeType) {
    case NodeType.datasource:
    case NodeType.subPackage:
    case NodeType.rootPackage:
      return true
    default:
      // add special logic here if file should be expandable.
      return false
  }
}

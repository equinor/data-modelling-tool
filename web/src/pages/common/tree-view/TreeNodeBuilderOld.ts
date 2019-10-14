import { IndexNode, NodeType } from '../../../api/types'
import { NodeIconType, TreeNodeData } from '../../../components/tree-view/types'

type IndexNodeV2 = {
  id: string
  filename: string
  nodeType: NodeType
  children?: string[]
  templateRef?: string
  meta?: object
  type?: string
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
      type: node.type,
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
  type = '',
}: IndexNodeV2) {
  return {
    nodeId: id,
    title: filename,
    templateRef,
    nodeType,
    meta,
    isExpandable: isExpandable(type, children),
    isOpen: false,
    isRoot: type === NodeType.DATA_SOURCE,
    isHidden: false,
    children: children || [],
    icon: getNodeIcon(type, children),
    isFolder: true,
  }
}

export class TreeNodeBuilder extends TreeNodeBuilderOld {
  constructor(node: IndexNodeV2) {
    super({
      id: node.id,
      title: node.filename,
      nodeType: node.nodeType,
      children: node.children,
      type: '',
    })
  }
}

function getNodeIcon(nodeType: string, children: string[]): NodeIconType {
  switch (nodeType) {
    case NodeType.SIMOS_BLUEPRINT:
      return NodeIconType.file
    case NodeType.SIMOS_BLUEPRINT_ATTRIBUTE:
      return NodeIconType.ref
    case NodeType.DATA_SOURCE:
      return NodeIconType.database
    default:
      if (children.length > 0) {
        return NodeIconType.folder
      } else {
        return NodeIconType.file
      }
  }
}

function isExpandable(nodeType: string, children: string[]): boolean {
  switch (nodeType) {
    default:
      return children.length > 0
  }
}

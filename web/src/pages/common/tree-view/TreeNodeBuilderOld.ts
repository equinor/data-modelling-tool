import {
  NodeIconType,
  NodeMetaData,
  TreeNodeData,
} from '../../../components/tree-view/Tree'
import { IndexNode } from '../../../api/Api'
import { NodeType } from '../../../util/variables'

type IndexNodeV2 = {
  id: string
  filename: string
  isRootPackage?: boolean
  nodeType: NodeType
  children?: string[]
  templateRef?: string
  meta?: NodeMetaData
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
    meta: { ...meta, type },
    isExpandable: isExpandable(type, children),
    isOpen: false,
    isRoot: type === NodeType.DATA_SOURCE,
    isHidden: false,
    children: children || [],
    icon: getNodeIcon(type, children),
    isFolder: true,
  }
}

function getNodeIcon(nodeType: string, children: string[]): NodeIconType {
  switch (nodeType) {
    case NodeType.PACKAGE:
      return NodeIconType.folder
    case NodeType.BLUEPRINT:
      return NodeIconType.blueprint
    case NodeType.BLUEPRINT_ATTRIBUTE:
      return NodeIconType.ref
    case NodeType.DATA_SOURCE:
      return NodeIconType.database
    case NodeType.APPLICATION:
      return NodeIconType.laptop
    default:
      return NodeIconType.file
  }
}

function isExpandable(nodeType: string, children: string[]): boolean {
  if (nodeType === NodeType.PACKAGE) {
    return true
  } else {
    return children.length > 0
  }
}

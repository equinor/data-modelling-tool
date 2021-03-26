import values from 'lodash/values'
import {
  NodeIconType,
  NodeMetaData,
  TreeNodeData,
} from '../../components/tree-view/Tree'
import { NodeType } from '../../utils/variables'
import { IndexNode, IndexNodes } from '../../services/api/interfaces/IndexAPI'

export type DocumentNode = {
  id: string
  filename: string
  isRootPackage?: boolean
  empty?: boolean
  nodeType: NodeType
  children?: string[]
  templateRef?: string
  meta?: NodeMetaData
  type?: string
  isOpen?: boolean
}

export function createTreeNode({
  id,
  filename,
  nodeType,
  children = [],
  templateRef = '',
  meta = {},
  type = '',
  isOpen = false,
}: DocumentNode): TreeNodeData {
  return {
    nodeId: id,
    title: filename,
    templateRef,
    nodeType,
    meta: { ...meta, type },
    isExpandable: isExpandable(type, children, meta),
    isOpen: type === NodeType.DATA_SOURCE || isOpen,
    isRoot: type === NodeType.DATA_SOURCE,
    isHidden: false,
    children: children || [],
    icon: getNodeIcon(type),
    isFolder: true,
    isLoading: false,
  }
}

function getNodeIcon(nodeType: string): NodeIconType {
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

function isExpandable(
  nodeType: string,
  children: string[],
  meta: any
): boolean {
  if (meta.empty) return false
  if (nodeType === NodeType.PACKAGE) {
    return true
  } else {
    return children.length > 0
  }
}

export const toTreeNodes = (index: IndexNodes): TreeNodeData[] => {
  const indexNodes: IndexNode[] = values(index)
  // Transform index to list of tree nodes
  return indexNodes.map((node: IndexNode) => {
    return createTreeNode({
      id: node.id,
      filename: node.title,
      nodeType: node.nodeType,
      children: node.children,
      templateRef: node.templateRef,
      meta: node.meta,
      type: node.type,
    })
  })
}

export function toObject(acc: any, current: TreeNodeData) {
  ;(acc as any)[current.nodeId] = current
  return acc
}

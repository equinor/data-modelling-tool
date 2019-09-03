import { IndexNode } from '../../../api/Api'
import { NodeType } from '../../../components/tree-view/TreeReducer'
import { TreeNodeData } from '../../../components/tree-view/Tree'

export class TreeNodeBuilder {
  nodeId: string
  children: string[]
  title: string
  isOpen: boolean
  isRoot: boolean
  nodeType: NodeType

  constructor(node: IndexNode) {
    this.nodeId = node.id
    this.nodeId = node.id
    this.isRoot = node.isRoot
    this.title = node.title
    this.isOpen = node.isOpen || false
    this.nodeType = NodeType.folder
    this.children = node.children || []
  }

  setOpen(open: boolean) {
    this.isOpen = open
    return this
  }

  buildFolderNode(): TreeNodeData {
    this.isRoot = false
    this.nodeType = NodeType.folder
    return this
  }

  static stripVersion(id: string): string {
    return id.replace(/\d+\.\d+\.\d+\//, '')
  }

  buildFileNode(): TreeNodeData {
    this.isRoot = false
    this.nodeType = NodeType.file
    return this
  }
}

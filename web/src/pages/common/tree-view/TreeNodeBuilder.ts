import { IndexNode } from '../../../api/Api'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { NodeType } from '../../../api/types'

export class TreeNodeBuilder {
  nodeId: string
  children: string[]
  title: string
  isOpen: boolean
  isRoot: boolean
  nodeType: NodeType

  constructor(node: IndexNode) {
    this.nodeId = node.id
    this.isRoot = node.isRoot
    this.title = node.title
    this.isOpen = node.isOpen || false
    this.nodeType = node.nodeType
    this.children = node.children || []
  }

  setOpen(open: boolean) {
    this.isOpen = open
    return this
  }

  //@todo add buildRootFolderNode
  buildFolderNode(): TreeNodeData {
    this.isRoot = false
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

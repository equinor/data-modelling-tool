import { TreeViewUtil } from './TreeviewUtil'

export type IndexNode = {
  _id: string
}

export class GenerateTreeview {
  private nodes: object

  constructor(nodes: any) {
    this.nodes = nodes
  }

  addRootNode(title: string, isOpen: boolean = false) {
    ;(this.nodes as any)[title] = {
      title,
      path: title,
      isRoot: true,
      type: 'folder',
      children: [],
      isOpen,
    }
    return this
  }

  addPackage(id: string, rootNode: string) {
    id = TreeViewUtil.getId(id, rootNode)
    ;(this.nodes as any)[id] = {
      path: id,
      isRoot: false,
      type: 'folder',
      children: [],
    }
    return this
  }

  addFile(id: string, rootNode: string) {
    id = TreeViewUtil.getId(id, rootNode)
    ;(this.nodes as any)[id] = {
      path: id,
      isRoot: false,
      type: 'file',
    }
  }

  addNodes(index: any[], rootNode: string) {
    index.sort(TreeViewUtil.sortNodes).forEach((node: IndexNode) => {
      const id = TreeViewUtil.getId(node._id, rootNode)
      TreeViewUtil.addToParent(this.nodes, id)
      if (TreeViewUtil.isFile(id)) {
        this.addFile(id, rootNode)
      } else {
        this.addPackage(id, rootNode)
      }
    })
    return this
  }

  build() {
    console.log(this.nodes)
    return this.nodes
  }
}

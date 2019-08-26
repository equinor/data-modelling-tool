import { TreeViewUtil } from './TreeviewUtil'
import { values } from 'lodash'

export type IndexNode = {
  _id: string
}

export class GenerateTreeview {
  private nodes: object

  constructor(nodes: any) {
    this.nodes = nodes
  }

  private addVersion(id: string, isOpen: boolean) {
    TreeViewUtil.addToParent(this.nodes, id)
    ;(this.nodes as any)[id] = {
      nodeId: id,
      isRoot: false,
      type: 'folder',
      isOpen,
      title: id.substr(id.lastIndexOf('/') + 1),
      children: [],
    }
  }

  private addPackage(id: string, rootNode: string, isOpen: boolean) {
    TreeViewUtil.addToParent(this.nodes, id)
    ;(this.nodes as any)[id] = {
      nodeId: id,
      isRoot: false,
      type: 'folder',
      isHidden: false,
      isOpen,
      title: id.substr(id.lastIndexOf('/') + 1),
      children: [],
    }
  }

  private addFile(id: string, rootNode: string) {
    id = TreeViewUtil.getId(id, rootNode)
    TreeViewUtil.addToParent(this.nodes, id)
    ;(this.nodes as any)[id] = {
      nodeId: id,
      isRoot: false,
      isHidden: false,
      title: id.substr(id.lastIndexOf('/') + 1),
      type: 'file',
    }
  }

  // builder methods.
  addRootNode(title: string, isOpen: boolean = false) {
    ;(this.nodes as any)[title] = {
      title,
      isHidden: false,
      nodeId: title,
      isRoot: true,
      type: 'folder',
      children: [],
      isOpen,
    }
    return this
  }

  createPackage(id: string, rootNode: string) {
    id = TreeViewUtil.getId(id, rootNode)
    // add package
    const parentId = TreeViewUtil.getParentId(id)
    if (!TreeViewUtil.hasNode(this.nodes, parentId)) {
      this.addPackage(parentId, rootNode, true)
    }
    // add version
    if (!TreeViewUtil.hasNode(this.nodes, id)) {
      this.addPackage(id, rootNode, true)
    }
    TreeViewUtil.setOpen(this.nodes, id)
    return this
  }

  createFile(id: string, rootNode: string) {
    id = TreeViewUtil.getId(id, rootNode)
    this.addFile(id, rootNode)
    TreeViewUtil.setOpen(this.nodes, TreeViewUtil.getParentId(id))
    return this
  }

  addNodes(index: object) {
    console.log(index)
    // const sorted = values(index).sort(TreeViewUtil.sortNodes);
    this.nodes = index
    return this
  }

  build() {
    return this.nodes
  }
}

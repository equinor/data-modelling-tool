import { IndexNode } from './generateTreeview'

export class TreeViewUtil {
  static getId(id: string, rootNode: string): string {
    //packages and subpackages should not have filename.
    if (!id.startsWith(rootNode + '/')) {
      return rootNode + '/' + id.replace('/package.json', '')
    }
    return id.replace('/package.json', '')
  }

  static stripLastSlash(id: string) {
    return id.substr(0, id.lastIndexOf('/'))
  }

  static getParentId(id: string) {
    return TreeViewUtil.stripLastSlash(id)
  }

  static isFile(id: string): boolean {
    return TreeViewUtil.getType(id) === 'file'
  }

  static getType(id: string): string {
    return id.indexOf('.json') > -1 ? 'file' : 'folder'
  }

  static sortNodes(a: IndexNode, b: IndexNode) {
    return TreeViewUtil.getId(a._id, '').localeCompare(
      TreeViewUtil.getId(b._id, '')
    )
  }

  static addToParent(nodes: object, id: string) {
    const parentPath = TreeViewUtil.getParentId(id)
    const parentChildren = (nodes as any)[parentPath].children
    if (!parentChildren.includes(id)) {
      parentChildren.push(id)
    }
  }

  static hasNode(nodes: object, id: string) {
    return (nodes as any)[id] ? true : false
  }

  static setOpen(nodes: object, id: string) {
    ;(nodes as any)[id].isOpen = true
    const parentId = TreeViewUtil.getParentId(id)

    //open recursive.
    if (parentId) {
      this.setOpen(nodes, parentId)
    }
  }
}

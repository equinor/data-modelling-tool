export interface TreeviewIndex {
  _id: string
  title?: string
  name?: string
}

function isRootNode(_id: string) {
  return _id.indexOf('/') === -1
}

function getType(_id: string) {
  return _id.indexOf('.') > -1 ? 'file' : 'folder'
}

export function generateTreeViewNodes(index: TreeviewIndex[]) {
  const nodes = {}

  index.forEach(current => {
    const id = current._id
    const isRoot = isRootNode(id)
    const type = getType(id)
    const path = '/' + id

    // @ts-ignore
    const node = {
      isRoot,
      path,
      type,
      title: current.title || current.name,
    }
    if (type === 'folder') {
      // @ts-ignore
      node.children = []
    }

    if (!isRoot) {
      //fix children.
      const parentPath = getParentPath(id)
      // @ts-ignore
      nodes[parentPath].children.push(path)
    }
    //@ts-ignore
    nodes[path] = node
  })
  return nodes
}

export function getParentPath(path: string) {
  const indexOfLastPath = path.lastIndexOf('/')
  return '/' + path.substr(0, indexOfLastPath)
}

export interface TreeviewIndex {
  path: string
  title: string
}

export function generateTreeview(index: TreeviewIndex[], endpoint: string) {
  const treeViewLeafNodes = index.map(node => {
    return Object.assign({}, node, {
      endpoint,
      type: 'file',
    })
  })
  return treeViewLeafNodes.reduce((acc: any, currentNode: any) => {
    //add leaf node.
    acc[currentNode.path] = currentNode

    let path = getParentPath(currentNode.path)
    let previousPath: string = currentNode.path

    while (previousPath) {
      const newNode: any = {
        path,
        type: 'folder',
      }

      //add isRoot
      const isRoot = (path.match(/\//g) || []).length === 1
      if (isRoot) {
        console.log(path)
        newNode.isRoot = true
      }

      //add children
      newNode.children = [previousPath]

      if (isRoot) {
        //end loop.
        previousPath = ''
      } else {
        previousPath = path
      }
      acc[path] = newNode
      path = getParentPath(path)

      // console.log('new path', path);
    }
    // console.log(acc);
    return acc
  }, {})
}

function getParentPath(path: string) {
  const indexOfLastPath = path.lastIndexOf('/')
  return path.substr(0, indexOfLastPath)
}

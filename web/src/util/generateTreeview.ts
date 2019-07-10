export interface TreeviewIndex {
  _id: string
  title: string
}

export function generateTreeview(
  state: any,
  index: TreeviewIndex[],
  endpoint: string
) {
  const treeViewLeafNodes = index.map((node: any) => {
    return {
      path: '/' + node['_id'],
      title: node.title,
      endpoint,
      type: 'file',
    }
  })
  return treeViewLeafNodes.reduce(
    (acc: any, currentNode: any) => {
      //add leaf node.
      acc[currentNode.path] = currentNode

      let path = getParentPath(currentNode.path)
      let previousPath: string = currentNode.path

      while (previousPath) {
        let node: any = acc[path]
        if (!node) {
          node = {
            path,
            type: 'folder',
          }
        }

        //add isRoot
        const isRoot = (path.match(/\//g) || []).length === 1
        if (isRoot) {
          node.isRoot = true
        }

        console.log()
        if (node.children && node.children.length > 0) {
          node.children.push(previousPath)
        } else {
          //add children
          node.children = [previousPath]
        }

        if (isRoot) {
          //end loop.
          previousPath = ''
        } else {
          previousPath = path
        }
        console.log(path)
        if (path) {
          acc[path] = node
          path = getParentPath(path)
        }

        // console.log('new path', path);
      }
      // console.log(acc);
      return acc
    },
    { ...state }
  )
}

function getParentPath(path: string) {
  const indexOfLastPath = path.lastIndexOf('/')
  return path.substr(0, indexOfLastPath)
}

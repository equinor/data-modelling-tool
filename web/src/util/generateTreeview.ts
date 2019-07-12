export interface TreeviewIndex {
  _id: string
  title: string
}

export function generateTreeViewItem(
  state: any,
  indexItem: TreeviewIndex,
  endpoint: string
) {
  const newState = generateTreeview(state, [indexItem], endpoint)
  const rootPath = '/' + indexItem._id.substr(0, indexItem._id.indexOf('/'))
  newState[rootPath].isOpen = true
  return newState
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

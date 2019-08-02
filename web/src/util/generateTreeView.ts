export interface TreeviewIndex {
  _id: string
  title?: string
  name?: string
}

export function generateTreeViewItem(
  state: any,
  indexItem: TreeviewIndex,
  endpoint: string
) {
  const newState = generateTreeViewNodes(state, [indexItem], endpoint)
  const rootPath = '/' + indexItem._id.substr(0, indexItem._id.indexOf('/'))
  newState[rootPath].isOpen = true
  return newState
}

export function generateRootPackageNodes(
  state: any,
  index: TreeviewIndex[],
  endpoint: string
) {
  return index.map(generateTreeViewLeafNodes(endpoint)).reduce(
    (acc, currentNode) => {
      acc[getParentPath(currentNode.path)] = {
        path: getParentPath(currentNode.path),
        type: 'folder',
        isRoot: true,
        children: [],
      }
      return acc
    },
    { ...state }
  )
}

export function generateTreeViewNodes(
  state: any,
  index: TreeviewIndex[],
  endpoint: string
) {
  return index.map(generateTreeViewLeafNodes(endpoint)).reduce(
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

export function getParentPath(path: string) {
  const indexOfLastPath = path.lastIndexOf('/')
  return path.substr(0, indexOfLastPath)
}

function generateTreeViewLeafNodes(endpoint: string) {
  return (node: any) => {
    return {
      path: '/' + node['_id'],
      title: node.title,
      endpoint,
      type: 'file',
    }
  }
}

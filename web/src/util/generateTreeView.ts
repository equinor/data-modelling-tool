export interface TreeviewIndex {
  _id: string
  title?: string
  name?: string
  version?: string
}

type Node = {
  path: string
  type: string
  title: string
  isRoot: boolean
  children?: string[]
}

const sortIsRoot = (a: any, b: any) => (b.isRoot ? 1 : -1) - (a.isRoot ? 1 : -1)
const sortType = (a: any, b: any) =>
  (b.type === 'folder' ? 1 : -1) - (a.type === 'folder' ? 1 : -1)

export function generateTreeViewNodes(index: TreeviewIndex[], nodes = {}) {
  index
    // bug in radix dev.
    .filter(node => node._id !== 'undefined' && node._id)
    .map(node => ({
      ...node,
      type: node._id.indexOf('package.json') > -1 ? 'folder' : 'file',
      isRoot: node._id.split('/').length === 2,
    }))
    //sort boolean
    .sort(sortIsRoot)
    .sort(sortType)
    .forEach((current: any) => {
      // const parentPath = getParentPath(current._id)
      const path = current._id
      const { type, isRoot } = current
      if (type === 'folder') {
        if (isRoot) {
          //root package
          ;(nodes as any)[path] = {
            isRoot,
            type,
            path,
            title: current.title,
            children: getChildren(path, nodes),
          }
        } else {
          const parentPath = getParentPath(path)
          const useVersion = parentPath.split('/').length === 2
          ;(nodes as any)[parentPath].children.push(path)
          ;(nodes as any)[path] = {
            isRoot,
            type,
            path,
            title: useVersion ? current.version : current.title,
            children: getChildren(path, nodes),
          }
        }
      }
      if (type === 'file') {
        const parentPath = getParentPath(path)
        ;(nodes as any)[parentPath].children.push(path)
        ;(nodes as any)[path] = {
          isRoot,
          type,
          path,
          title: current.title,
        }
      }
    })
  return nodes
}

function getChildren(path: string, nodes: any) {
  if (nodes && (nodes as any)[path]) {
    return (nodes as any)[path].children
  }
  return []
}

function getParentPath(path: string): string {
  // remove /package.json to simplify grabbing parent path.
  const paths = path.replace('/package.json', '')
  return paths.substring(0, paths.lastIndexOf('/')) + '/package.json'
}

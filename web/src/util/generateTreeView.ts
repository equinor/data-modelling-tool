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

const toObject = (acc: any, current: Node) => {
  acc[current.path] = current
  return acc
}

const filterPackages = (item: TreeviewIndex) => isRoot(item._id)
const filterSubPackages = (item: TreeviewIndex) =>
  !isRoot(item._id) && item._id.indexOf('package.json') > -1
const filterFiles = (item: TreeviewIndex) =>
  item._id.indexOf('package.json') === -1 //cover bot package.json and subpackage.json

export function generateTreeViewNodes(index: TreeviewIndex[]) {
  const packages: any = index
    .filter(filterPackages)
    .map((current: TreeviewIndex) => {
      // const parentPath = getParentPath(current._id)
      return {
        path: current._id,
        isRoot: true,
        type: 'folder',
        title: current.title || '',
        children: [],
      }
    })
    .reduce(toObject, {})

  const subPackages: Node[] = index
    .filter(filterSubPackages)
    .map((item: TreeviewIndex) => {
      const parentPath = getParentPath(item._id) + 'package.json'
      ;(packages as any)[parentPath].children.push(item._id)
      return {
        path: item._id,
        isRoot: false,
        type: 'folder',
        title: item.version || '',
        children: [],
      }
    })
    .reduce(toObject, {})

  const files: Node[] = index
    .filter(filterFiles)
    .map((item: TreeviewIndex) => {
      const parentPath =
        item._id.substring(0, item._id.lastIndexOf('/')) + '/package.json'
      ;(subPackages as any)[parentPath].children.push(item._id)
      return {
        path: item._id,
        isRoot: false,
        type: 'file',
        title: item.title || item.name || '',
      }
    })
    .reduce(toObject, {})

  return {
    ...packages,
    ...subPackages,
    ...files,
  }
}

function isRoot(path: string) {
  return path.split('/').length === 2 && path.indexOf('package.json') > -1
}

export function getParentPath(path: string) {
  const match = path.match(/\d.\d.\d/gi)
  if (match) {
    const lastVersion = match[match.length - 1]
    const indexOfLastPath = path.indexOf(lastVersion)
    const parentPath = path.substr(0, indexOfLastPath)
    return parentPath
  }
  throw Error('failed to get parent path: ' + path)
}

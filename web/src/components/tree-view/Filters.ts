import values from 'lodash/values'
import { TreeNodeData } from './Tree'

const defaultMatcher = (filterText: string, node: TreeNodeData) => {
  return (
    node && node.title.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
  )
}

const nodeMatchesOrHasMatchingDescendants: any = (
  data: any,
  node: TreeNodeData,
  filter: string,
  matcher: any
) => {
  return (
    matcher(filter, node) || // i match
    (node &&
    node.children && // or i have decendents and one of them match
      node.children.length &&
      !!node.children.find((childNode: string) =>
        nodeMatchesOrHasMatchingDescendants(
          data,
          data[childNode],
          filter,
          matcher
        )
      ))
  )
}

export const expandNodesWithMatchingDescendants = (
  data: any,
  nodes: any,
  filter: any,
  matcher: any = defaultMatcher
) => {
  return nodes.map((node: TreeNodeData) => {
    let isOpen = false
    if (node.children && node.children.length) {
      let childrenWithMatches = node.children.filter((child: string) =>
        nodeMatchesOrHasMatchingDescendants(data, data[child], filter, matcher)
      )
      isOpen = !!childrenWithMatches.length // i expand if any of my kids match
    }
    return Object.assign({}, node, { isOpen: isOpen })
  })
}

export const hideNodesWithNoMatchingDescendants = (
  data: any,
  filter: any,
  matcher: any = defaultMatcher
) => {
  return values(data).map((node: TreeNodeData) => {
    if (matcher(filter, node)) {
      return Object.assign({}, node, { isHidden: false })
    } else {
      //if not then only keep the ones that match or have matching descendants
      if (node.children) {
        let filteredChildren = node.children.filter((child: any) =>
          nodeMatchesOrHasMatchingDescendants(
            data,
            data[child],
            filter,
            matcher
          )
        )
        if (filteredChildren && filteredChildren.length) {
          return Object.assign({}, node, { isHidden: false })
        }
      }
      return Object.assign({}, node, { isHidden: true })
    }
  })
}

export function filterNodes(nodes: any, filterPath: any) {
  function filterRecursive(filterPath: any, nodes: any, filteredNodes: any) {
    values(nodes).forEach((node: TreeNodeData) => {
      if (node.children) {
        const isParent = node.children.includes(filterPath)
        if (isParent) {
          filteredNodes[node.title] = Object.assign({}, node)
          if (!node.isRoot) {
            filterRecursive(node.title, nodes, filteredNodes)
          }
        }
      } else {
        if (filterPath === node.title) {
          filteredNodes[node.title] = Object.assign({}, node)
        }
      }
    })
  }

  const filteredNodes = {}
  filterRecursive(filterPath, nodes, filteredNodes)
  return filteredNodes
}

import values from 'lodash/values'

const defaultMatcher = (filterText, node) => {
  return (
    node && node.path.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
  )
}

const nodeMatchesOrHasMatchingDescendants = (data, node, filter, matcher) => {
  return (
    matcher(filter, node) || // i match
    (node &&
    node.children && // or i have decendents and one of them match
      node.children.length &&
      !!node.children.find(childNode =>
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
  data,
  nodes,
  filter,
  matcher = defaultMatcher
) => {
  return nodes.map(node => {
    let isOpen = false
    if (node.children && node.children.length) {
      let childrenWithMatches = node.children.filter(child =>
        nodeMatchesOrHasMatchingDescendants(data, data[child], filter, matcher)
      )
      isOpen = !!childrenWithMatches.length // i expand if any of my kids match
    }
    return Object.assign({}, node, { isOpen: isOpen })
  })
}

export const hideNodesWithNoMatchingDescendants = (
  data,
  filter,
  matcher = defaultMatcher
) => {
  return values(data).map(node => {
    if (matcher(filter, node)) {
      return Object.assign({}, node, { isHidden: false })
    } else {
      //if not then only keep the ones that match or have matching descendants
      if (node.children) {
        let filteredChildren = node.children.filter(child =>
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

export function filterNodes(nodes, filterPath) {
  function filterRecursive(filterPath, nodes, filteredNodes) {
    values(nodes).forEach(node => {
      if (node.children) {
        const isParent = node.children.includes(filterPath)
        if (isParent) {
          filteredNodes[node.path] = Object.assign({}, node)
          if (!node.isRoot) {
            filterRecursive(node.path, nodes, filteredNodes)
          }
        }
      } else {
        if (filterPath === node.path) {
          filteredNodes[node.path] = Object.assign({}, node)
        }
      }
    })
  }

  const filteredNodes = {}
  filterRecursive(filterPath, nodes, filteredNodes)
  return filteredNodes
}

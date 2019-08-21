import values from 'lodash/values'
import React from 'react'
import TreeNode from './TreeNode'
import TreeReducer from './TreeReducer'
import {
  expandNodesWithMatchingDescendants,
  hideNodesWithNoMatchingDescendants,
} from './Filters'
import keyBy from 'lodash/keyBy'

type TreeProps = {
  children: Function
  tree: object
  onNodeSelect?: (node: TreeData) => any
  searchTerm: string
}

export type TreeData = {
  path: string
  type: 'file' | 'folder'
  isOpen: boolean
  title: string
  isRoot: boolean
  node: TreeData
  isHidden?: boolean
}

export default (props: TreeProps) => {
  let tree = props.tree
  let searchTerm = props.searchTerm

  if (searchTerm) {
    const filter = searchTerm.trim()
    let filteredNodes = hideNodesWithNoMatchingDescendants(tree, filter)
    let expandedNodes = expandNodesWithMatchingDescendants(
      tree,
      filteredNodes,
      filter
    )
    let nodesAsObject = keyBy(expandedNodes, 'path')
    tree = { ...nodesAsObject }
  }

  const rootNodes = values(tree).filter((n: TreeData) => n.isRoot)

  return (
    <>
      {rootNodes
        .filter((node: TreeData) => !node.isHidden)
        .map((node: TreeData) => {
          return (
            <TreeNode
              key={node.path}
              level={0}
              node={node}
              nodes={tree}
              NodeRenderer={props.children}
              onNodeSelect={props.onNodeSelect}
            />
          )
        })}
    </>
  )
}

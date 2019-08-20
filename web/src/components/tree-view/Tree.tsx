import values from 'lodash/values'
import React from 'react'
import TreeNode, { TreeNodeType } from './TreeNode'

type TreeProps = {
  children: any
  tree: any
  onToggle: any
  onNodeSelect?: (node: TreeNodeType) => any
}

export default (props: TreeProps) => {
  const rootNodes = values(props.tree).filter((n: TreeNodeType) => n.isRoot)

  return (
    <>
      {rootNodes
        .filter((node: TreeNodeType) => !node.isHidden)
        .map((node: TreeNodeType) => {
          return (
            <TreeNode
              key={node.path}
              level={0}
              node={node}
              nodes={props.tree}
              onToggle={props.onToggle}
              NodeRenderer={props.children}
              onNodeSelect={props.onNodeSelect}
            />
          )
        })}
    </>
  )
}

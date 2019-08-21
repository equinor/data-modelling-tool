import values from 'lodash/values'
import React from 'react'
import TreeNode from './TreeNode'

type TreeProps = {
  children: Function
  tree: object
  onToggle: (node: TreeData) => any
  onNodeSelect?: (node: TreeData) => any
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
  const rootNodes = values(props.tree).filter((n: TreeData) => n.isRoot)

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

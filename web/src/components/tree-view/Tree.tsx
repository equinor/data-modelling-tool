import values from 'lodash/values'
import React, { useReducer } from 'react'
import TreeNode from './TreeNode'
import TreeReducer, {
  Actions,
  NodeActions,
} from '../../components/tree-view/TreeReducer'
import SearchTree from './SearchTree'

export type TreeNodeData = {
  nodeId: string
  type: 'file' | 'folder'
  isOpen: boolean
  title: string
  isRoot: boolean
  node: TreeNodeData
  isHidden?: boolean //@todo needed?}
  children?: string[]
}

type TreeProps = {
  children: Function
  tree: any
  onNodeSelect?: (node: TreeNodeData) => any
}

export default (props: TreeProps) => {
  const [state, dispatch] = useReducer(TreeReducer, props.tree)

  const onToggle = (node: TreeNodeData): void => {
    dispatch(NodeActions.toggleNode(node.nodeId))
  }

  const rootNodes = values(state).filter((n: TreeNodeData) => n.isRoot)

  return (
    <>
      <div>
        <SearchTree
          onChange={(value: string) => dispatch(Actions.filterTree(value))}
        />
      </div>
      {rootNodes
        .filter((node: TreeNodeData) => !node.isHidden)
        .map((node: TreeNodeData) => {
          return (
            <TreeNode
              key={node.nodeId}
              level={0}
              node={node}
              dispatch={dispatch}
              nodes={state}
              onToggle={onToggle}
              NodeRenderer={props.children}
              onNodeSelect={props.onNodeSelect}
            />
          )
        })}
    </>
  )
}

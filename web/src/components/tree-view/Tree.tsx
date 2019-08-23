import values from 'lodash/values'
import React, { useReducer } from 'react'
import TreeNode from './TreeNode'
import TreeReducer, {
  Actions,
  NodeActions,
  NodeType,
} from '../../components/tree-view/TreeReducer'
import SearchTree from './SearchTree'

export type TreeNodeData = {
  nodeId: string
  type: NodeType
  isOpen: boolean
  title: string
  isRoot: boolean
  node: TreeNodeData
  isHidden?: boolean
  children?: string[]
}

type TreeProps = {
  children: Function
  tree: object
  onNodeSelect?: (node: TreeNodeData) => TreeNodeData
}

export default (props: TreeProps) => {
  const [state, dispatch] = useReducer(TreeReducer, props.tree)

  const handleToggle = (node: TreeNodeData): void =>
    dispatch(NodeActions.toggleNode(node.nodeId))

  const handleSearch = (term: string) => dispatch(Actions.filterTree(term))

  const rootNodes = values(state).filter((node: TreeNodeData) => node.isRoot)

  return (
    <>
      <SearchTree onChange={handleSearch} />
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
              onToggle={handleToggle}
              NodeRenderer={props.children}
              onNodeSelect={props.onNodeSelect}
            />
          )
        })}
    </>
  )
}

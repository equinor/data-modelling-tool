import React, { useReducer } from 'react'
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa'
import styled from 'styled-components'
import TreeReducer, { NodeActions, NodeType } from './TreeReducer'
import { TreeNodeData } from './Tree'
import { IndexNode } from '../../api/Api'
import ErrorBoundary from '../ErrorBoundary'

type StyledTreeNode = {
  level: number
}

const StyledTreeNode = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  padding-left: ${(props: StyledTreeNode) => props.level * 20}px;

  &:hover {
    background: lightgray;
  }
`

type NodeIconProps = {
  marginRight?: number
  onClick?: any
}

const NodeIcon = styled.div`
  font-size: 12px;
  margin-right: ${(props: NodeIconProps) =>
    props.marginRight ? props.marginRight : 5}px;
`

const getChildNodes = (node: IndexNode, nodes: any): any[] => {
  const children: any[] = []
  if (node.children) {
    node.children.forEach((nodeId: string) => {
      if (nodes[nodeId]) {
        children.push(nodes[nodeId])
      } else {
        console.warn('nodes have no child with id: ' + nodeId)
        console.log(nodeId)
        console.log(nodes)
      }
    })
  }
  return children
}

type TreeNodeProps = {
  NodeRenderer: Function
  nodeId: any
  nodes: any
  level: number
  onNodeSelect?: (node: TreeNodeData) => void
}

const TreeNode = (props: TreeNodeProps) => {
  const { nodeId, nodes, level, onNodeSelect, NodeRenderer } = props
  const [state, dispatch] = useReducer(TreeReducer, nodes)
  const node = state[nodeId]

  const handleToggle = (node: IndexNode): void =>
    dispatch(NodeActions.toggleNode(node._id))

  if (!node) {
    return null
  }
  const type = node.nodeType === 'file' ? 'file' : 'folder'
  return (
    <ErrorBoundary>
      <StyledTreeNode level={level}>
        <NodeIcon onClick={() => handleToggle(node)}>
          {type === 'folder' &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={5}>
          {type === 'file' && <FaFile />}
          {type === 'folder' && node.isOpen && <FaFolderOpen />}
          {type === 'folder' && !node.isOpen && <FaFolder />}
        </NodeIcon>

        <TreeChildren
          dispatch={dispatch}
          NodeRenderer={NodeRenderer}
          onNodeSelect={onNodeSelect}
          node={node}
        />
      </StyledTreeNode>

      {node.isOpen &&
        getChildNodes(node, nodes)
          .filter((node: any) => !node.isHidden)
          .map((childNode: any) => (
            <TreeNode
              key={`tree-node-${childNode._id}`}
              nodes={nodes}
              NodeRenderer={NodeRenderer}
              nodeId={childNode._id}
              level={level + 1}
            />
          ))}
    </ErrorBoundary>
  )
}

const TreeChildren = (props: any) => {
  const { node, NodeRenderer, onNodeSelect, dispatch } = props

  const addNode = (nodeId: string, nodeType: NodeType) => {
    dispatch(NodeActions.createNode(nodeId, nodeType))
    dispatch(NodeActions.addChild(node._id, nodeId))
  }

  const updateNode = (nodeId: string, title: string) => {
    dispatch(NodeActions.updateNode(nodeId, title))
  }
  return (
    <span
      role="button"
      onClick={() => {
        try {
          onNodeSelect && onNodeSelect(node)
          // onToggle(node)
        } catch (e) {
          console.error('failed to click on node', e)
        }
      }}
    >
      {NodeRenderer(node, addNode, updateNode)}
    </span>
  )
}

export default TreeNode

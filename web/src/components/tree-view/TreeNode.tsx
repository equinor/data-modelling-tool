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

const getChildNodes = (node: TreeNodeData, nodes: any) => {
  if (!node.children) return []
  return node.children.map((nodeId: string) => nodes[nodeId])
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

  const handleToggle = (node: TreeNodeData): void =>
    dispatch(NodeActions.toggleNode(node.nodeId))

  const addNode = (nodeId: string, nodeType: NodeType) => {
    dispatch(NodeActions.createNode(nodeId, nodeType))
    dispatch(NodeActions.addChild(node.nodeId, nodeId))
  }

  const updateNode = (title: string) => {
    dispatch(NodeActions.updateNode(node.nodeId, title))
  }

  return (
    <React.Fragment>
      <StyledTreeNode level={level}>
        <NodeIcon onClick={() => handleToggle(node)}>
          {node.type === 'folder' &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={5}>
          {node.type === 'file' && <FaFile />}
          {node.type === 'folder' && node.isOpen && <FaFolderOpen />}
          {node.type === 'folder' && !node.isOpen && <FaFolder />}
        </NodeIcon>

        <span
          role="button"
          onClick={() => {
            onNodeSelect && onNodeSelect(node)
            // onToggle(node)
          }}
        >
          {NodeRenderer(node, addNode, updateNode)}
        </span>
      </StyledTreeNode>

      {node.isOpen &&
        getChildNodes(node, nodes)
          .filter((node: any) => !node.isHidden)
          .map((childNode: any) => (
            <TreeNode
              key={`tree-node-${childNode.nodeId}`}
              nodes={nodes}
              NodeRenderer={NodeRenderer}
              nodeId={childNode.nodeId}
              level={level + 1}
            />
          ))}
    </React.Fragment>
  )
}

export default TreeNode

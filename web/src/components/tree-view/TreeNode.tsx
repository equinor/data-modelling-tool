import React from 'react'
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa'
import styled from 'styled-components'
import { NodeActions, NodeType } from './TreeReducer'
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
  NodeRenderer: any
  key: string
  node: TreeNodeData
  nodes: object
  level: number
  onToggle: (node: TreeNodeData) => any
  onNodeSelect?: (node: TreeNodeData) => any
  dispatch: any
}

const TreeNode = (props: TreeNodeProps) => {
  const {
    node,
    dispatch,
    nodes,
    level,
    onToggle,
    onNodeSelect,
    NodeRenderer,
  } = props

  const addNode = (nodeId: string, nodeType: NodeType) => {
    const action = NodeActions.createNode(nodeId, nodeType)
    dispatch(action)
    dispatch(NodeActions.addChild(node.nodeId, action.nodeId))
  }

  const updateNode = (title: string) => {
    dispatch(NodeActions.updateNode(node.nodeId, title))
  }

  return (
    <React.Fragment>
      <StyledTreeNode level={level}>
        <NodeIcon onClick={() => onToggle(node)}>
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
              key={'treenode' + childNode.nodeId}
              {...props}
              node={childNode}
              level={level + 1}
            />
          ))}
    </React.Fragment>
  )
}

export default TreeNode

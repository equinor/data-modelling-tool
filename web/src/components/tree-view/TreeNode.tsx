import React from 'react'
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa'
import styled from 'styled-components'
import { TreeNodeData } from './Tree'
import { NodeType } from './TreeReducer'

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

type TreeNodeProps = {
  NodeRenderer: Function
  level: number
  onNodeSelect?: (node: TreeNodeData) => void
  node: TreeNodeData
  updateNode: Function
  addNode: Function
  handleToggle: Function
}

const TreeNode = (props: TreeNodeProps) => {
  const {
    node,
    level,
    onNodeSelect,
    NodeRenderer,
    updateNode,
    addNode,
    handleToggle,
  } = props

  return (
    <div>
      <StyledTreeNode level={level}>
        <NodeIcon onClick={() => handleToggle(node)}>
          {node.nodeType === NodeType.folder &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={5}>
          {node.nodeType === NodeType.file && <FaFile />}
          {node.nodeType === NodeType.folder && node.isOpen && <FaFolderOpen />}
          {node.nodeType === NodeType.folder && !node.isOpen && <FaFolder />}
        </NodeIcon>

        <span
          role="button"
          onClick={() => {
            onNodeSelect && onNodeSelect(node)
            handleToggle(node)
          }}
        >
          {NodeRenderer(node, addNode, updateNode)}
        </span>
      </StyledTreeNode>
    </div>
  )
}

export default TreeNode

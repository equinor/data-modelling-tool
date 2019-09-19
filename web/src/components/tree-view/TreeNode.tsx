import React from 'react'
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
  FaDatabase,
} from 'react-icons/fa'
import styled from 'styled-components'
import { TreeNodeData } from './Tree'
import { NodeType } from '../../api/types'

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

export type TreeNodeProps = {
  NodeRenderer: Function
  level: number
  node: TreeNodeData
  updateNode: Function
  addNode: Function
  handleToggle: Function
}

const Content = styled.div`
  width: 100%;
`

const TreeNode = (props: TreeNodeProps) => {
  const { node, level, NodeRenderer, updateNode, addNode, handleToggle } = props
  const expandableNodeTypes = [NodeType.folder]
  const isFolder = [NodeType.folder].includes(node.nodeType)
  return (
    <div>
      <StyledTreeNode level={level}>
        <NodeIcon onClick={() => handleToggle(node)}>
          {expandableNodeTypes.includes(node.nodeType) &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={5}>
          {node.nodeType === NodeType.datasource && <FaDatabase />}
          {node.nodeType === NodeType.file && <FaFile />}
          {isFolder && node.isOpen && <FaFolderOpen />}
          {isFolder && !node.isOpen && <FaFolder />}
        </NodeIcon>

        <Content
          role="button"
          onClick={() => {
            handleToggle(node)
          }}
        >
          {NodeRenderer(node, addNode, updateNode)}
        </Content>
      </StyledTreeNode>
    </div>
  )
}

export default TreeNode

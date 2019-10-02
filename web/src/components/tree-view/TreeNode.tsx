import React from 'react'
import {
  FaChevronDown,
  FaChevronRight,
  FaDatabase,
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaCircle,
} from 'react-icons/fa'
import styled from 'styled-components'
import { NodeIconType, TreeNodeData } from './Tree'

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
  removeNode: Function
  replaceNode: Function
  path: string
  parent: string
}

const Content = styled.div`
  width: 100%;
`

const TreeNode = (props: TreeNodeProps) => {
  const {
    node,
    level,
    NodeRenderer,
    updateNode,
    addNode,
    handleToggle,
    removeNode,
    replaceNode,
    path,
    parent,
  } = props

  return (
    <div>
      <StyledTreeNode level={level}>
        <NodeIcon
          onClick={() => {
            handleToggle(node)
          }}
        >
          {node.isExpandable && node.isOpen && <FaChevronDown />}
          {node.isExpandable && !node.isOpen && <FaChevronRight />}
        </NodeIcon>

        <NodeIcon marginRight={5}>
          {node.icon === NodeIconType.database && <FaDatabase />}
          {node.icon === NodeIconType.file && <FaFile />}
          {node.icon === NodeIconType.ref && <FaCircle />}
          {node.icon === NodeIconType.folder && node.isOpen && <FaFolderOpen />}
          {node.icon === NodeIconType.folder && !node.isOpen && <FaFolder />}
        </NodeIcon>

        <Content
          role="button"
          onClick={() => {
            handleToggle(node)
          }}
        >
          {NodeRenderer(
            path,
            parent,
            node,
            addNode,
            updateNode,
            removeNode,
            replaceNode
          )}
        </Content>
      </StyledTreeNode>
    </div>
  )
}

export default TreeNode

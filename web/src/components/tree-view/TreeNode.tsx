import React from 'react'
import {
  FaChevronDown,
  FaChevronRight,
  FaDatabase,
  FaFolder,
  FaFolderOpen,
  FaCircle,
  FaLaptop,
  FaRegFileAlt,
} from 'react-icons/fa'
import styled from 'styled-components'
import { NodeIconType, TreeNodeData } from './Tree'
import { NodeType } from '../../util/variables'

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
  path: string
  parent: string
  node: TreeNodeData
  actions: TreeNodeActions
  handleToggle: Function
}

export type AddNode = (node: TreeNodeData, parentId: string) => void
export type AddNodes = (nodes: object) => void
export type AddChild = (parentId: string, childId: string) => void
export type UpdateNode = (node: TreeNodeData) => void
export type RemoveNode = (nodeId: string, parentId: string) => void
export type ReplaceNode = (
  parentId: string,
  oldId: string,
  newId: string,
  title: string
) => void

export type TreeNodeActions = {
  updateNode: UpdateNode
  addNode: AddNode
  addNodes: AddNodes
  addChild: AddChild
  removeNode: RemoveNode
  replaceNode: ReplaceNode
}

export type TreeNodeRenderProps = {
  path: string
  parent: string
  nodeData: TreeNodeData
  actions: TreeNodeActions
}

const Content = styled.div`
  width: 100%;
`

const TreeNode = (props: TreeNodeProps) => {
  const {
    node,
    level,
    NodeRenderer,
    path,
    parent,
    actions,
    handleToggle,
  } = props

  const renderProps = {
    path,
    parent,
    nodeData: node,
    actions,
  } as TreeNodeRenderProps

  return (
    <div>
      <StyledTreeNode level={level}>
        <NodeIcon>
          {node.isExpandable && node.isOpen && <FaChevronDown />}
          {node.isExpandable && !node.isOpen && <FaChevronRight />}
        </NodeIcon>

        <NodeIcon marginRight={5}>
          {node.icon === NodeIconType.database && <FaDatabase />}
          {node.icon === NodeIconType.file && <FaRegFileAlt />}
          {node.icon === NodeIconType.ref && <FaCircle />}
          {node.icon === NodeIconType.laptop && <FaLaptop />}
          {node.icon === NodeIconType.folder && node.isOpen && <FaFolderOpen />}
          {node.icon === NodeIconType.folder && !node.isOpen && <FaFolder />}
        </NodeIcon>

        <Content role="button" onClick={() => handleToggle(node)}>
          {NodeRenderer(renderProps)}
        </Content>
      </StyledTreeNode>
    </div>
  )
}

export default TreeNode

import React from 'react'
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa'
import styled from 'styled-components'
import ContextMenu from '../context-menu/ContextMenu'
import values from 'lodash/values'

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

type WithContextMenuProps = {
  label: string
  menuItems: any[]
  id: string
  onClickContextMenu: any
}

const WithContextMenu = (props: WithContextMenuProps) => {
  const { label, menuItems } = props
  if (menuItems.length === 0) {
    return <span>{label}</span>
  }
  return <ContextMenu {...props}>{label}</ContextMenu>
}

const getChildNodes = (node: any, nodes: any) => {
  if (!node.children) return []
  return node.children.map((path: string) => nodes[path])
}

export type TreeNodeType = {
  path: string
  type: 'file' | 'folder'
  isOpen: boolean
  title: string
  isRoot: boolean
  node: TreeNodeType
  isHidden?: boolean //@todo needed?}
}

type TreeProps = {
  children: any
  tree: any
  onToggle: any
  onNodeSelect?: (node: TreeNodeType) => any
}

type TreeNodeProps = {
  NodeRenderer: any
  key: string
  node: TreeNodeType
  nodes: object
  level: number
  onToggle: (node: TreeNodeType) => any
  onNodeSelect?: (node: TreeNodeType) => any
}

export default (props: TreeProps) => {
  const rootNodes = values(props.tree).filter((n: TreeNodeType) => n.isRoot)

  return (
    <>
      {rootNodes
        .filter((node: TreeNodeType) => !node.isHidden)
        .map((node: TreeNodeType) => {
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

const TreeNode = (props: TreeNodeProps) => {
  const { node, nodes, level, onToggle, onNodeSelect, NodeRenderer } = props
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
            onToggle(node)
          }}
        >
          {NodeRenderer(node)}
        </span>
      </StyledTreeNode>

      {node.isOpen &&
        getChildNodes(node, nodes)
          .filter((node: any) => !node.isHidden)
          .map((childNode: any) => (
            <TreeNode
              key={'treenode' + childNode.path}
              {...props}
              node={childNode}
              level={level + 1}
            />
          ))}
    </React.Fragment>
  )
}

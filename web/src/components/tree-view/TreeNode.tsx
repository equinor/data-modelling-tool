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

export type MenuItem = {
  type: string
  action: string
  label: string
  hideRoot?: boolean
  onlyRoot?: boolean
  hideVersion?: boolean
  onlyVersion?: boolean
}

type TreeNodeProps = {
  key: string
  node: TreeNodeType
  nodes: object
  level: number
  onToggle: (node: TreeNodeType) => any
  onClickContextMenu: (id: string, action: string) => any
  onNodeSelect: (node: TreeNodeType) => any
  menuItems: MenuItem[]
}

const TreeNode = (props: TreeNodeProps) => {
  const {
    node,
    nodes,
    level,
    onToggle,
    onNodeSelect,
    onClickContextMenu,
    menuItems,
  } = props
  return (
    <React.Fragment>
      <StyledTreeNode level={level}>
        <NodeIcon onClick={() => onToggle(node)}>
          {node.type === 'folder' &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={5}>
          {node.type === 'file' && <FaFile />}
          {node.type === 'folder' && node.isOpen === true && <FaFolderOpen />}
          {node.type === 'folder' && !node.isOpen && <FaFolder />}
        </NodeIcon>

        <span
          role="button"
          onClick={() => {
            onNodeSelect(node)
          }}
        >
          <WithContextMenu
            id={node.path}
            onClickContextMenu={onClickContextMenu}
            menuItems={menuItems
              .filter(filterLevel(node.isRoot))
              .filter(filterVersion(node))
              .filter((item: any) => item.type === node.type)}
            label={node.title}
          />
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

function filterLevel(isNodeRoot: any) {
  return (item: any) => {
    if (item.onlyRoot && !isNodeRoot) {
      return false
    }
    if (item.hideRoot && isNodeRoot) {
      return false
    }
    return true //bypass.
  }
}

function filterVersion(node: TreeNodeType) {
  const isVersion = node.title.indexOf('.') > -1
  return (item: any) => {
    if (item.onlyVersion && !isVersion) {
      return false
    }
    if (item.hideVersion && isVersion) {
      return false
    }
    return true //bypass, filter is not needed.
  }
}

export default TreeNode

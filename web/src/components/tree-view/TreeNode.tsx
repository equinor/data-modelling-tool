import React from 'react'
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa'
import styled from 'styled-components'
import { TreeData } from './Tree'

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

const getChildNodes = (node: any, nodes: any) => {
  if (!node.children) return []
  return node.children.map((path: string) => nodes[path])
}

type TreeNodeProps = {
  NodeRenderer: any
  key: string
  node: TreeData
  nodes: object
  level: number
  onToggle: (node: TreeData) => any
  onNodeSelect?: (node: TreeData) => any
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
          .filter((node: TreeData) => !node.isHidden)
          .map((childNode: TreeData) => (
            <TreeNode
              key={`tree-node-${childNode.path}`}
              {...props}
              node={childNode}
              level={level + 1}
            />
          ))}
    </React.Fragment>
  )
}

export default TreeNode

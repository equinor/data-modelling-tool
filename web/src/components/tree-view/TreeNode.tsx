import React, { useEffect, useState } from 'react'
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa'
import styled from 'styled-components'
import { TreeData } from './Tree'
import useToggle from '../use-toogle/useToogle'

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
  onNodeSelect?: (node: TreeData) => any
}

const TreeNode = (props: TreeNodeProps) => {
  const { node, nodes, level, onNodeSelect, NodeRenderer } = props
  const [checked, toggle] = useState(node.isOpen)

  useEffect(() => {
    toggle(node.isOpen)
  }, [node.isOpen])

  return (
    <>
      <StyledTreeNode level={level}>
        <NodeIcon onClick={() => toggle(!checked)}>
          {node.type === 'folder' &&
            (checked ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={5}>
          {node.type === 'file' && <FaFile />}
          {node.type === 'folder' && checked && <FaFolderOpen />}
          {node.type === 'folder' && !checked && <FaFolder />}
        </NodeIcon>

        <span
          role="button"
          onClick={() => {
            onNodeSelect && onNodeSelect(node)
            // @ts-ignore
            // toggle(!checked)
          }}
        >
          {NodeRenderer(node)}
        </span>
      </StyledTreeNode>

      {checked &&
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
    </>
  )
}

export default TreeNode

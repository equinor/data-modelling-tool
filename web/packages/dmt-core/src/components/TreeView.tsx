import { TreeNode } from '../domain/Tree'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  FaChevronDown,
  FaChevronRight,
  FaDatabase,
  FaExclamationTriangle,
  FaFolder,
  FaFolderOpen,
  FaList,
  FaRegFileAlt,
} from 'react-icons/fa'
import { Progress, Tooltip } from '@equinor/eds-core-react'
import React from 'react'
import { EBlueprint } from '../Enums'

type TStyledTreeNode = {
  level: number
}

const ExpandButton = styled.div`
  margin: 0 3px;
  width: 15px;
`

const StyledTreeNode = styled.div`
  align-items: center;
  display: flex;
  padding-left: ${(props: TStyledTreeNode) => props.level * 20}px;
  cursor: pointer;
  width: -webkit-fill-available;
  &:hover {
    background-color: #acb7da;
  }
`

export type TNodeWrapperProps = {
  node: TreeNode
  removeNode?: () => void
  children: any
  onSelect?: (node: TreeNode) => void
}

const GetIcon = (props: { node: TreeNode; expanded: boolean }) => {
  const { node, expanded } = props
  if (Array.isArray(node.entity)) {
    return <FaList />
  }
  if (Array.isArray(node?.parent?.entity)) {
    return <label>{'{}'}</label>
  }
  switch (node.type) {
    case 'dataSource':
      return <FaDatabase style={{ color: 'gray' }} />
    case 'error':
      return <FaExclamationTriangle style={{ color: 'orange' }} />
    case EBlueprint.BLUEPRINT:
      return <FaRegFileAlt style={{ color: '#2966FF' }} />
    case EBlueprint.PACKAGE:
      if (expanded) {
        if (node.isRoot) {
          return <FaFolderOpen style={{ color: '#8531A3' }} />
        } else {
          return <FaFolderOpen />
        }
      } else {
        if (node.isRoot) {
          return <FaFolder style={{ color: '#8531A3' }} />
        } else {
          return <FaFolder />
        }
      }
    default:
      return <FaRegFileAlt />
  }
}

const TreeNodeComponent = (props: {
  node: TreeNode
  expanded: boolean
  onClick: (node: TreeNode, setLoading: (l: boolean) => void) => void
}) => {
  const { node, expanded, onClick } = props
  const [loading, setLoading] = useState<boolean>(false)
  return (
    <StyledTreeNode
      key={node.nodeId}
      level={node.level}
      onClick={() => {
        if (node.type !== 'error') onClick(node, setLoading)
      }}
    >
      {[EBlueprint.PACKAGE, 'dataSource'].includes(node.type || '') ? (
        <ExpandButton>
          {expanded ? <FaChevronDown /> : <FaChevronRight />}
        </ExpandButton>
      ) : (
        <div style={{ width: '18px' }} />
      )}
      <GetIcon node={node} expanded={expanded} />
      <Tooltip
        enterDelay={600}
        title={node?.message || node?.type || ''}
        placement="top-start"
      >
        <div style={{ paddingLeft: '5px' }}>{node.name || node.nodeId}</div>
      </Tooltip>
      {loading && (
        <Progress.Circular
          color={'primary'}
          size={16}
          style={{ marginLeft: '5px' }}
        />
      )}
    </StyledTreeNode>
  )
}

export const TreeView = (props: {
  nodes: TreeNode[]
  onSelect: (node: TreeNode) => void
  NodeWrapper?: React.FunctionComponent<TNodeWrapperProps>
  NodeWrapperOnClick?: (node: TreeNode) => void
}) => {
  const { nodes, onSelect, NodeWrapper, NodeWrapperOnClick } = props
  // Use a per TreeView state to keep track of expanded nodes.
  // This is so clicking in one tree will not affect other TreeViews
  const [expandedNodes, setExpandedNodes] = useState<{ [k: string]: boolean }>(
    {}
  )

  useEffect(() => {
    const expandedNodes: { [k: string]: boolean } = {}
    nodes.forEach((node: TreeNode) => {
      // Initialize expanded state where only top level nodes are expanded
      expandedNodes[node.nodeId] = node.level === 0
    })
    setExpandedNodes(expandedNodes)
  }, [])

  const _onClick = (node: TreeNode, setLoading: (l: boolean) => void) => {
    const newExpandedNodes: { [k: string]: boolean } = {}
    if (!expandedNodes[node.nodeId]) {
      setLoading(true)
      node.expand().finally(() => setLoading(false))
      newExpandedNodes[node.nodeId] = true
    } else {
      // Set all children nodes as collapsed recursively
      // @ts-ignore
      for (const child of node) {
        newExpandedNodes[child.nodeId] = false
      }
      newExpandedNodes[node.nodeId] = false
    }
    setExpandedNodes({ ...expandedNodes, ...newExpandedNodes })
    if (![EBlueprint.PACKAGE, 'dataSource'].includes(node.type)) {
      onSelect(node)
    }
  }

  return (
    <>
      {nodes.map((node: TreeNode) => {
        // If it has a parent, and the parent is not expanded, hide node
        if (node?.parent && !expandedNodes[node.parent?.nodeId]) return null
        if (NodeWrapper) {
          return (
            <NodeWrapper
              node={node}
              key={node.nodeId}
              onSelect={NodeWrapperOnClick}
            >
              <TreeNodeComponent
                node={node}
                expanded={expandedNodes[node.nodeId]}
                onClick={(node: TreeNode, setLoading: (l: boolean) => void) =>
                  _onClick(node, setLoading)
                }
              />
            </NodeWrapper>
          )
        } else {
          return (
            <TreeNodeComponent
              key={node.nodeId}
              node={node}
              expanded={expandedNodes[node.nodeId]}
              onClick={(node: TreeNode, setLoading: (l: boolean) => void) =>
                _onClick(node, setLoading)
              }
            />
          )
        }
      })}
    </>
  )
}

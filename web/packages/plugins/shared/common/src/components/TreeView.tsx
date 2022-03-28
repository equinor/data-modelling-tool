import { Tree, TreeNode } from '../domain/Tree'
import React, { useContext, useEffect, useState } from 'react'
import { ApplicationContext, AuthContext, BlueprintEnum } from '../index'
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
import { CircularProgress, Tooltip } from '@equinor/eds-core-react'

type StyledTreeNode = {
  level: number
}

const ExpandButton = styled.div`
  margin: 0 3px;
  width: 15px;
`

const StyledTreeNode = styled.div`
  align-items: center;
  display: flex;
  padding-left: ${(props: StyledTreeNode) => props.level * 20}px;
  cursor: pointer;

  &:hover {
    background-color: #acb7da;
  }
`

const GetIcon = (props: { node: TreeNode }) => {
  const { node } = props
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
    case BlueprintEnum.BLUEPRINT:
      return <FaRegFileAlt style={{ color: '#2966FF' }} />
    case BlueprintEnum.PACKAGE:
      if (node.expanded) {
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
  onClick: (node: TreeNode) => void
}) => {
  const { node, onClick } = props
  return (
    <StyledTreeNode
      key={node.nodeId}
      level={node.level}
      onClick={() => onClick(node)}
    >
      {[BlueprintEnum.PACKAGE, 'dataSource'].includes(node.type || '') ? (
        <ExpandButton>
          {node.expanded ? <FaChevronDown /> : <FaChevronRight />}
        </ExpandButton>
      ) : (
        <div style={{ width: '18px' }} />
      )}
      <GetIcon node={node} />
      <Tooltip
        enterDelay={600}
        title={node?.message || node?.type || ''}
        placement="top-start"
      >
        <div style={{ paddingLeft: '5px' }}>{node.name || node.nodeId}</div>
      </Tooltip>
    </StyledTreeNode>
  )
}

export const TreeView = (props: {
  onSelect: (node: TreeNode) => void
  NodeWrapper?: React.ReactElement
}) => {
  const { onSelect, NodeWrapper } = props
  // @ts-ignore
  const { token } = useContext(AuthContext)
  const appConfig = useContext(ApplicationContext)
  const tree = new Tree(token, appConfig.visibleDataSources)
  const [index, setIndex] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    tree
      .init()
      // @ts-ignore
      .then(() => setIndex([...tree]))
      .finally(() => setLoading(false))
  }, [])

  const _onClick = (node: TreeNode) => {
    if (!node.expanded) {
      // @ts-ignore
      node.expand().then(() => setIndex([...node.tree]))
    } else {
      node.collapse()
      // @ts-ignore
      setIndex([...node.tree])
    }
    if (![BlueprintEnum.PACKAGE, 'dataSource'].includes(node.type)) {
      onSelect(node)
    }
  }

  const removeNode = (node: TreeNode) => {
    node.remove()
    // @ts-ignore
    setIndex([...node.tree])
  }

  if (loading) return <CircularProgress value={0} />

  return (
    <>
      {index.map((node: TreeNode) => {
        if (node?.parent?.expanded === false) return null
        if (NodeWrapper) {
          return (
            // @ts-ignore
            <NodeWrapper node={node} key={node.nodeId} removeNode={removeNode}>
              <TreeNodeComponent
                node={node}
                onClick={(node) => _onClick(node)}
              />
            </NodeWrapper>
          )
        } else {
          return (
            <TreeNodeComponent node={node} onClick={(node) => _onClick(node)} />
          )
        }
      })}
    </>
  )
}

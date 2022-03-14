import { SimpleTree, SimpleTreeNode } from './Tree'
import React, { useContext, useEffect, useState } from 'react'
import { ApplicationContext, AuthContext, BlueprintEnum } from '..'
import styled from 'styled-components'

import {
  FaChevronDown,
  FaChevronRight,
  FaDatabase,
  FaExclamationTriangle,
  FaFolder,
  FaFolderOpen,
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
  background-color: whitesmoke;
  display: flex;
  padding-left: ${(props: StyledTreeNode) => props.level * 20}px;
  cursor: pointer;

  &:hover {
    background-color: #acb7da;
  }
`

const GetIcon = (props: { node: SimpleTreeNode }) => {
  const { node } = props
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

export const SimpleTreeView = (props: {
  onSelect: (node: SimpleTreeNode) => void
}) => {
  const { onSelect } = props
  // @ts-ignore
  const { token } = useContext(AuthContext)
  const appConfig = useContext(ApplicationContext)
  const tree = new SimpleTree(token, appConfig.visibleDataSources)
  const [index, setIndex] = useState<SimpleTreeNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    tree
      .init()
      // @ts-ignore
      .then(() => setIndex([...tree]))
      .finally(() => setLoading(false))
  }, [])

  const _onClick = (node: SimpleTreeNode) => {
    if ([BlueprintEnum.PACKAGE, 'dataSource'].includes(node.type || '')) {
      if (!node.expanded) {
        // @ts-ignore
        node.expand().then(() => setIndex([...node.tree]))
      } else {
        node.collapse()
        // @ts-ignore
        setIndex([...node.tree])
      }
    } else {
      onSelect(node)
    }
  }

  if (loading) return <CircularProgress value={0} />

  return (
    <div>
      {index.map((node: SimpleTreeNode) => {
        if (node?.parent?.expanded === false) return null
        return (
          <StyledTreeNode
            key={node.nodeId}
            level={node.level}
            onClick={() => _onClick(node)}
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
              <div style={{ paddingLeft: '5px' }}>
                {node.name || node.nodeId}
              </div>
            </Tooltip>
          </StyledTreeNode>
        )
      })}
    </div>
  )
}

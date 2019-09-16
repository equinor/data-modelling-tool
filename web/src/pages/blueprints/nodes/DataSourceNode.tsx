import React from 'react'
import FileUpload from '../../common/tree-view/FileUpload'
import styled from 'styled-components'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { MenuItem } from '../../../components/context-menu/ContextMenu'
import { FaFolder } from 'react-icons/fa'
import WithContextMenu from '../../common/context-menu-actions/WithContextMenu'
import { ContextMenuActions } from '../../common/context-menu-actions/ContextMenuActionsFactory'

type Props = {
  node: TreeNodeData
  state: any
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const DataSourceNode = (props: Props) => {
  const { node, state } = props

  const menuItems: MenuItem[] = [
    {
      label: 'New',
      menuItems: [
        {
          label: 'Package',
          action: ContextMenuActions.createPackage,
          icon: FaFolder,
        },
      ],
    },
    {
      action: ContextMenuActions.editDataSource,
      label: 'Edit',
    },
  ]

  return (
    <Wrapper>
      <WithContextMenu node={node} menuItems={menuItems} />
      {node.nodeId === 'local' && (
        <FileUpload state={state} datasource={state.dataSources[0]} />
      )}
    </Wrapper>
  )
}

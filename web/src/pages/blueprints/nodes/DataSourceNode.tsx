import React from 'react'
import FileUpload from '../../common/tree-view/FileUpload'
import styled from 'styled-components'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { MenuItem } from '../../../components/context-menu/ContextMenu'
import { FaFolder } from 'react-icons/fa'
import WithContextMenu from '../../common/context-menu-actions/WithContextMenu'
import { ContextMenuActions } from '../../common/context-menu-actions/ContextMenuActionsFactory'
import {
  AddNode,
  RemoveNode,
  ReplaceNode,
  UpdateNode,
} from '../../common/tree-view/DocumentTree'

type Props = {
  treeNodeData: TreeNodeData
  state: any
  addNode: AddNode
  updateNode: UpdateNode
  removeNode: RemoveNode
  replaceNode: ReplaceNode
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const DataSourceNode = (props: Props) => {
  const {
    treeNodeData,
    state,
    addNode,
    updateNode,
    removeNode,
    replaceNode,
  } = props

  const menuItems: MenuItem[] = [
    {
      label: 'New',
      menuItems: [
        {
          label: 'Package',
          action: ContextMenuActions.createRootPackage,
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
      <WithContextMenu
        treeNodeData={treeNodeData}
        menuItems={menuItems}
        addNode={addNode}
        updateNode={updateNode}
        removeNode={removeNode}
        replaceNode={replaceNode}
      />
      {treeNodeData.nodeId === 'local' && (
        <FileUpload state={state} datasource={state.dataSources[0]} />
      )}
    </Wrapper>
  )
}

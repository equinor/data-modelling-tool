import React from 'react'
import { MenuItem } from '../../../components/context-menu/ContextMenu'
import { FaFile } from 'react-icons/fa'
import { ContextMenuActions } from '../context-menu-actions/ContextMenuActionsFactory'
import {
  AddNode,
  RemoveNode,
  RenderProps,
  ReplaceNode,
  UpdateNode,
} from '../tree-view/DocumentTree'
import { TreeNodeData, treeNodes } from '../../../components/tree-view/Tree'
import WithContextMenu from '../context-menu-actions/WithContextMenu'

interface Props extends RenderProps {
  treeNodeData: TreeNodeData
  addNode: AddNode
  updateNode: UpdateNode
  removeNode: RemoveNode
  replaceNode: ReplaceNode
  path: string
  parent: string
}

export const ArrayPlaceholderNode = (props: Props) => {
  const { treeNodeData } = props

  const { meta } = treeNodeData

  const { itemName = '' } = meta as any

  const menuItems: MenuItem[] = [
    {
      label: 'New',
      menuItems: [
        {
          label: `${itemName}`,
          action: ContextMenuActions.ADD_ITEM_TO_ARRAY,
          icon: FaFile,
        },
      ],
    },
  ]

  return (
    <WithContextMenu
      {...props}
      menuItems={menuItems}
      treeNodeData={treeNodeData}
    />
  )
}

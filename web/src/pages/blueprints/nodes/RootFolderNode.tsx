import React from 'react'
import { NodeComponentProps } from '../../common/tree-view/DocumentTree'
import WithContextMenu from '../../common/context-menu-actions/WithContextMenu'
import { MenuItem } from '../../../components/context-menu/ContextMenu'
import { FaFile, FaFolder } from 'react-icons/fa'
import { ContextMenuActions } from '../../common/context-menu-actions/ContextMenuActionsFactory'

export const RootFolderNode = (props: NodeComponentProps) => {
  const { node } = props

  const menuItems: MenuItem[] = [
    {
      label: 'New',
      menuItems: [
        {
          label: 'Blueprint',
          action: ContextMenuActions.createBlueprint,
          icon: FaFile,
        },
        {
          label: 'Package',
          action: ContextMenuActions.createPackage,
          icon: FaFolder,
        },
      ],
    },
    {
      label: 'Rename',
      action: ContextMenuActions.editPackage,
    },
  ]

  return <WithContextMenu node={node} menuItems={menuItems} />
}

import React, { useState } from 'react'
import { NodeComponentProps } from '../../common/tree-view/DocumentTree'
import { editPackage } from '../../common/context-menu-actions/EditPackage'
import WithContextMenu from '../../common/context-menu-actions/WithContextMenu'
import { ActionConfig } from '../../common/context-menu-actions/Types'
import { MenuItem } from '../../../components/context-menu/ContextMenu'
import { FaFile, FaFolder } from 'react-icons/fa'
import { createPackage } from '../../common/context-menu-actions/CreatePackage'
import { createBlueprint } from '../../common/context-menu-actions/CreateBlueprint'

export const FolderNode = (props: NodeComponentProps) => {
  const { node, updateNode, addNode } = props
  const [showModal, setShowModal] = useState(false)

  const menuItems: MenuItem[] = [
    {
      label: 'New',
      menuItems: [
        {
          label: 'Blueprint',
          action: 'New Blueprint',
          icon: FaFile,
        },
        {
          label: 'Package',
          action: 'New Package',
          icon: FaFolder,
        },
      ],
    },
    {
      label: 'Edit',
      action: 'Edit Package',
    },
  ]

  const configs: ActionConfig[] = [
    {
      action: 'New Blueprint',
      formProps: createBlueprint({
        node,
        addNode,
        setShowModal,
      }),
    },
    {
      action: 'New Package',
      formProps: createPackage({ node }),
    },
    {
      action: 'Edit Package',
      formProps: editPackage({
        node,
        updateNode,
        setShowModal,
      }),
    },
  ]

  return (
    <WithContextMenu
      setShowModal={setShowModal}
      showModal={showModal}
      node={node}
      configs={configs}
      menuItems={menuItems}
    />
  )
}

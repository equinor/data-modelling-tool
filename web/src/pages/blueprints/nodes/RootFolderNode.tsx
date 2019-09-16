import React, { useState } from 'react'
import { DmtApi } from '../../../api/Api'
import { NodeComponentProps } from '../../common/tree-view/DocumentTree'
import { editPackage } from '../../common/context-menu-actions/EditPackage'
import { ActionConfig } from '../../common/context-menu-actions/Types'
import WithContextMenu from '../../common/context-menu-actions/WithContextMenu'
import { createBlueprint } from '../../common/context-menu-actions/CreateBlueprint'
import { MenuItem } from '../../../components/context-menu/ContextMenu'
import { FaFile, FaFolder } from 'react-icons/fa'
import { createPackage } from '../../common/context-menu-actions/CreatePackage'

export const RootFolderNode = (props: NodeComponentProps) => {
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
      label: 'Rename',
      action: 'Edit Package',
    },
  ]

  const configs: ActionConfig[] = [
    {
      action: 'New Package',
      formProps: createPackage({ node }),
    },
    {
      action: 'New Blueprint',
      formProps: createBlueprint({ node, addNode, setShowModal }),
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
      node={node}
      menuItems={menuItems}
      configs={configs}
      showModal={showModal}
      setShowModal={setShowModal}
    />
  )
}

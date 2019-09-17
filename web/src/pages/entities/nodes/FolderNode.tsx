import React, { useState } from 'react'
import ContextMenu, {
  MenuItem,
} from '../../../components/context-menu/ContextMenu'
import { FaFile, FaFolder } from 'react-icons/fa'
import { ContextMenuActions } from '../../common/context-menu-actions/ContextMenuActionsFactory'
import Modal from '../../../components/modal/Modal'
import { BlueprintPickerContent } from '../BlueprintPicker'
import { TreeNodeData } from '../../../components/tree-view/Tree'

export const FolderNode = (props: any) => {
  const { node, state, dispatch } = props
  const [showModal, setShowModal] = useState(false)

  const menuItems: MenuItem[] = [
    {
      label: 'New',
      menuItems: [
        {
          label: 'Add Blueprint',
          action: ContextMenuActions.addBlueprint,
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

  return (
    <>
      <Modal
        toggle={() => setShowModal(!showModal)}
        open={showModal}
        title={'Select Blueprint'}
      >
        <BlueprintPickerContent
          state={state}
          dispatch={dispatch}
          onNodeSelect={(node: TreeNodeData) => {
            console.log('use blueprint: ' + node.nodeId)
          }}
        />
      </Modal>
      <ContextMenu
        id={node.nodeId}
        onClickContextMenu={() => {
          setShowModal(!showModal)
        }}
        menuItems={menuItems}
      >
        {node.title}
      </ContextMenu>
    </>
  )
}

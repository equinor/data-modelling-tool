import React, { useState } from 'react'
import ContextMenu, {
  MenuItem,
} from '../../../components/context-menu/ContextMenu'
import { FaFile, FaFolder } from 'react-icons/fa'
import { ContextMenuActions } from '../../common/context-menu-actions/ContextMenuActionsFactory'
import Modal from '../../../components/modal/Modal'
import { BlueprintPickerContent } from '../BlueprintPicker'
import { RenderProps } from '../../common/tree-view/DocumentTree'
import { TreeNodeData } from '../../../components/tree-view/Tree'

interface Props extends RenderProps {
  sourceNode?: TreeNodeData
  state: any
  dispatch: Function
}

export const FolderNode = (props: Props) => {
  const { treeNodeData, state, dispatch } = props
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
          sourceNode={treeNodeData}
          state={state}
          dispatch={dispatch}
        />
      </Modal>
      <ContextMenu
        id={treeNodeData.nodeId}
        onClickContextMenu={() => {
          setShowModal(!showModal)
        }}
        menuItems={menuItems}
      >
        {treeNodeData.title}
      </ContextMenu>
    </>
  )
}

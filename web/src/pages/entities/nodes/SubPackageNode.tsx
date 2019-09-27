import React from 'react'
import { MenuItem } from '../../../components/context-menu/ContextMenu'
import { FaFile, FaFolder } from 'react-icons/fa'
import { ContextMenuActions } from '../../common/context-menu-actions/ContextMenuActionsFactory'
import { BlueprintPickerContent } from '../BlueprintPicker'
import { RenderProps } from '../../common/tree-view/DocumentTree'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import Form from '../../../components/Form'
import { WithContextMenuModal } from '../../common/context-menu-actions/WithContextMenu'

interface Props extends RenderProps {
  sourceNode: TreeNodeData
  state: any
}

export const SubPackageNode = (props: Props) => {
  const { sourceNode, state, addNode } = props
  const menuItems: MenuItem[] = [
    {
      label: 'New',
      menuItems: [
        {
          label: 'Create entity',
          action: ContextMenuActions.addBlueprint,
          icon: FaFile,
        },
        {
          label: 'Package',
          action: ContextMenuActions.createSubPackage,
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
    <WithContextMenuModal
      {...props}
      menuItems={menuItems}
      render={({ action, actionConfig, setShowModal }: any) => {
        switch (action.type) {
          case ContextMenuActions.addBlueprint:
            return (
              <BlueprintPickerContent
                sourceNode={sourceNode}
                state={state}
                addNode={addNode}
                setShowModal={setShowModal}
              />
            )
          case ContextMenuActions.createSubPackage:
            return <>{actionConfig && <Form {...actionConfig.formProps} />}</>
          default:
            return null
        }
      }}
    />
  )
}

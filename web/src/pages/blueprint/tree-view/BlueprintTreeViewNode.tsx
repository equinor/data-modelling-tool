import React from 'react'
import { BlueprintAction, BlueprintActions } from '../BlueprintReducer'
import ContextMenu from '../../../components/context-menu/ContextMenu'
import { TreeNodeType } from '../../../components/tree-view/TreeNode'

type WithContextMenuProps = {
  label: string
  menuItems: any[]
  id: string
  onClickContextMenu: any
}

const WithContextMenu = (props: WithContextMenuProps) => {
  const { label } = props
  return <ContextMenu {...props}>{label}</ContextMenu>
}

type NodeProps = {
  node: TreeNodeType
  dispatch: (action: BlueprintAction) => void
}

export type NodeMenuItem = {
  action: string
  label: string
}

export const FolderNode = (props: NodeProps) => {
  const { node, dispatch } = props
  const menuItems: NodeMenuItem[] = [
    {
      action: 'create-blueprint',
      label: 'Create Blueprint',
    },
    // {
    //   action: 'add-subpackage',
    //   label: 'Create SubPackage',
    // },
    // {
    //   action: 'edit-subpackage',
    //   label: 'Edit Sub Package',
    // },
  ]

  return (
    <WithContextMenu
      id={node.path}
      onClickContextMenu={(id: any, action: string) => {
        switch (action) {
          case 'create-blueprint':
            dispatch(BlueprintActions.createBlueprint(id))
            break
          case 'edit-subpackage':
          case 'add-subpackage':
            dispatch(BlueprintActions.openModal(id, action))
            break
          default:
            console.error('action not supported: ', action, id)
        }
      }}
      menuItems={menuItems}
      label={node.title}
    />
  )
}

export const BlueprintNode = (props: NodeProps) => {
  const { node, dispatch } = props

  const openBlueprint = () => {
    dispatch(BlueprintActions.viewFile(node.path))
  }

  return <div onClick={openBlueprint}>{node.title}</div>
}

export const RootFolderNode = (props: NodeProps) => {
  const { node, dispatch } = props
  const ADD_PACKAGE = 'add-package'
  const menuItems: NodeMenuItem[] = [
    {
      action: ADD_PACKAGE,
      label: 'Create Package',
    },
  ]

  return (
    <WithContextMenu
      id={node.path}
      onClickContextMenu={(id: any, action: string) => {
        switch (action) {
          case ADD_PACKAGE:
            dispatch(BlueprintActions.openModal(id, ADD_PACKAGE))
            break
          default:
            console.error('action not supported: ', action, id)
        }
      }}
      menuItems={menuItems}
      label={node.title}
    />
  )
}

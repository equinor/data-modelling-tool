import React from 'react'
import {
  BlueprintAction,
  BlueprintActions,
  PageMode,
} from '../BlueprintReducer'
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
    {
      action: 'add-subpackage',
      label: 'Create SubPackage',
    },
    {
      action: 'edit-package',
      label: 'Edit Package',
    },
    {
      action: 'edit-subpackage',
      label: 'Edit Sub Package',
    },
  ]

  const setAction = (value: string) =>
    dispatch(BlueprintActions.setAction(value))
  const setOpen = (value: boolean) => dispatch(BlueprintActions.setOpen(value))
  const setNodePath = (value: string) =>
    dispatch(BlueprintActions.setSelectedBlueprintId(value))

  return (
    <WithContextMenu
      id={node.path}
      onClickContextMenu={(id: any, action: string) => {
        switch (action) {
          case 'create-blueprint':
            dispatch(BlueprintActions.setSelectedBlueprintId(id))
            dispatch(BlueprintActions.setPageMode(PageMode.create))
            break
          case 'add-package':
            setNodePath(id)
            setAction(action)
            setOpen(true)
            break
          case 'add-subpackage':
            setAction(action)
            setNodePath(id)
            setOpen(true)
            break
          case 'edit-package':
            setAction(action)
            setNodePath(id)
            setOpen(true)
            break
          case 'edit-subpackage':
            setAction(action)
            setNodePath(id)
            setOpen(true)
            break
          default:
            setAction('clear')
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
    dispatch(BlueprintActions.setSelectedBlueprintId(node.path))
    dispatch(BlueprintActions.setPageMode(PageMode.view))
  }

  return <div onClick={openBlueprint}>{node.title}</div>
}

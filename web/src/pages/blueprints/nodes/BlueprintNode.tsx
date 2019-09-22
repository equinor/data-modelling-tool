import React from 'react'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import {
  LayoutComponents,
  LayoutContext,
} from '../../common/golden-layout/LayoutContext'
import { MenuItem } from '../../../components/context-menu/ContextMenu'
import { ContextMenuActions } from '../../common/context-menu-actions/ContextMenuActionsFactory'
import WithContextMenu from '../../common/context-menu-actions/WithContextMenu'
import {
  AddNode,
  RemoveNode,
  UpdateNode,
} from '../../common/tree-view/DocumentTree'

type Props = {
  treeNodeData: TreeNodeData
  addNode: AddNode
  updateNode: UpdateNode
  removeNode: RemoveNode
}

export const BlueprintNode = (props: Props) => {
  const { treeNodeData } = props

  const menuItems: MenuItem[] = [
    {
      label: 'Remove',
      action: ContextMenuActions.removeFile,
    },
  ]

  return (
    <WithContextMenu
      {...props}
      treeNodeData={treeNodeData}
      menuItems={menuItems}
    >
      <LayoutContext.Consumer>
        {(layout: any) => {
          const data = {
            selectedDocumentId: treeNodeData.nodeId,
          }
          return (
            <div
              onClick={() =>
                layout.add(
                  treeNodeData.nodeId,
                  treeNodeData.title,
                  LayoutComponents.blueprint,
                  data
                )
              }
            >
              {treeNodeData.title}
            </div>
          )
        }}
      </LayoutContext.Consumer>
    </WithContextMenu>
  )
}

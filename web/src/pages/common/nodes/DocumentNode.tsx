import React from 'react'
import {
  AddNode,
  RemoveNode,
  RenderProps,
  ReplaceNode,
  UpdateNode,
} from '../tree-view/DocumentTree'
import WithContextMenu from '../context-menu-actions/WithContextMenu'
import { LayoutComponents, LayoutContext } from '../golden-layout/LayoutContext'
import { TreeNodeData } from '../../../components/tree-view/types'

interface Props extends RenderProps {
  treeNodeData: TreeNodeData
  addNode: AddNode
  updateNode: UpdateNode
  removeNode: RemoveNode
  replaceNode: ReplaceNode
  path: string
  parent: string
}

export const DocumentNode = (props: Props) => {
  const { treeNodeData } = props

  const { meta } = treeNodeData

  const { menuItems, onSelect } = meta as any

  return (
    <LayoutContext.Consumer>
      {(layout: any) => {
        const data = {
          selectedDocumentId: treeNodeData.nodeId,
        }
        return (
          <WithContextMenu
            {...props}
            treeNodeData={treeNodeData}
            menuItems={menuItems}
            layout={layout}
          >
            {onSelect && (
              <div
                onClick={() =>
                  layout.add(
                    onSelect.uid,
                    onSelect.title,
                    onSelect.component,
                    onSelect.data
                    /*
                                    treeNodeData.nodeId,
                                    treeNodeData.title,
                                    // TODO: Selected?
                                    LayoutComponents.blueprint,
                                    data
                                    */
                  )
                }
              >
                {treeNodeData.title}
              </div>
            )}
          </WithContextMenu>
        )
      }}
    </LayoutContext.Consumer>
  )
}

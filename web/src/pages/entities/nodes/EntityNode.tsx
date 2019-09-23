import React from 'react'
import {
  LayoutComponents,
  LayoutContext,
} from '../../common/golden-layout/LayoutContext'
import { RenderProps } from '../../common/tree-view/DocumentTree'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import Api2 from '../../../api/Api2'
import { TreeNodeBuilderOld } from '../../common/tree-view/TreeNodeBuilderOld'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { SetShowModal } from '../../common/context-menu-actions/WithContextMenu'

export const EntityNode = (props: RenderProps) => {
  const { treeNodeData } = props
  return (
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
                LayoutComponents.entity,
                data
              )
            }
          >
            {treeNodeData.title}
          </div>
        )
      }}
    </LayoutContext.Consumer>
  )
}

interface Props extends RenderProps {
  sourceNode: TreeNodeData
  newFileName: string
  setShowModal: SetShowModal
}

export const SelectBlueprintNode = (props: Props) => {
  const { treeNodeData, sourceNode, addNode, newFileName, setShowModal } = props
  return (
    <div
      onClick={() => {
        const sourceLevel = sourceNode.nodeId.split('/').length
        const targetLevel = treeNodeData.nodeId.split('/').length

        // protect against wrong index.
        if (sourceLevel !== targetLevel) {
          //@todo api should create missing packages and return list of nodes? then addNode multiple times?
          NotificationManager.error(
            'Please create missing package.',
            'Failed to create entity'
          )
        } else {
          // @todo input field in BlueprintPicker, optional new file name.
          Api2.addEntityFile({
            templateRef: treeNodeData.nodeId,
            nodeId: sourceNode.nodeId,
            filename: newFileName,
            onSuccess: (res: any) => {
              try {
                const newTreeNode = new TreeNodeBuilderOld(res.data)
                  .setOpen(true)
                  .build()
                addNode(newTreeNode, sourceNode.nodeId)
                //@todo close modal.
                setShowModal(false)
                NotificationManager.success(
                  newTreeNode.nodeId,
                  'Entity created'
                )
              } catch (err) {
                console.log(err)
              }
            },
          })
        }
      }}
    >
      {treeNodeData.title}
    </div>
  )
}

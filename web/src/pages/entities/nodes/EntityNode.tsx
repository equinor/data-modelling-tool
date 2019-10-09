import React from 'react'
import {
  LayoutComponents,
  LayoutContext,
} from '../../common/golden-layout/LayoutContext'
import { RenderProps } from '../../common/tree-view/DocumentTree'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import Api2 from '../../../api/Api2'
import { TreeNodeBuilder } from '../../common/tree-view/TreeNodeBuilderOld'
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
  )
}

interface Props extends RenderProps {
  sourceNode: TreeNodeData
  newFileName: string
  setShowModal: SetShowModal
}

export const SelectBlueprintNode = (props: Props) => {
  const {
    treeNodeData,
    sourceNode,
    addNode,
    newFileName,
    path,
    setShowModal,
  } = props
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
          const [sourceDataSourceId, sourceNodeId] = sourceNode.nodeId.split(
            '/'
          )
          /*
          Api2.addEntityFile({
            dataSourceId: sourceDataSourceId,
            templateRef: `${path}/${treeNodeData.title}`,
            parentId: sourceNodeId,
            filename: newFileName,
            attribute: 'blueprints',
            path: path,
            onSuccess: (res: any) => {
              try {
                const newEntityNode = new TreeNodeBuilder(res.entity)
                  .setOpen(true)
                  .build()
                addNode(newEntityNode, sourceNode.nodeId)
                res.refs.forEach((node: any) => {
                  const newRefNode = new TreeNodeBuilder(node)
                    .setOpen(true)
                    .build()
                  addNode(newRefNode, newEntityNode.nodeId)
                })
                //@todo close modal.
                // setShowModal(false)
                NotificationManager.success(
                  newEntityNode.nodeId,
                  'Entity created'
                )
                setShowModal(false)
              } catch (err) {
                console.log(err)
              }
            },
          })
           */
        }
      }}
    >
      {treeNodeData.title}
    </div>
  )
}

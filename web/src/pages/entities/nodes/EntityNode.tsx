import React from 'react'
import {
  LayoutComponents,
  LayoutContext,
} from '../../common/golden-layout/LayoutContext'
import { RenderProps } from '../../common/tree-view/DocumentTree'
import { TreeNodeData } from '../../../components/tree-view/Tree'

interface Props extends RenderProps {
  sourceNode?: TreeNodeData
}

export const EntityNode = (props: Props) => {
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

export const SelectBlueprintNode = (props: Props) => {
  const { treeNodeData, sourceNode } = props
  return (
    <div
      onClick={() => {
        console.log(treeNodeData, sourceNode)
        /*@todo
         * post package. create a new entity, show modal first and give it a name?
         * must know which node opened the select blueprint modal. this node will be the parent of the new entity.
         * templateRef of the new entity will be the node.id we just clicked on in the modal treeview.
         * */
      }}
    >
      {treeNodeData.title}
    </div>
  )
}

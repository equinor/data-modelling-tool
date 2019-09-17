import React from 'react'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import {
  LayoutComponents,
  LayoutContext,
} from '../../common/golden-layout/LayoutContext'

type Props = {
  node: TreeNodeData
  dispatch: Function
}

export const EntityNode = (props: Props) => {
  const { node } = props

  return (
    <LayoutContext.Consumer>
      {(layout: any) => {
        const data = {
          selectedDocumentId: node.nodeId,
        }
        return (
          <div
            onClick={() =>
              layout.add(node.nodeId, node.title, LayoutComponents.entity, data)
            }
          >
            {node.title}
          </div>
        )
      }}
    </LayoutContext.Consumer>
  )
}

export const SelectBlueprintNode = (props: Props) => {
  const { node, dispatch } = props
  return (
    <div
      onClick={() => {
        console.log(props)
        /*@todo
         * post package. create a new entity, show modal first and give it a name?
         * must know which node opened the select blueprint modal. this node will be the parent of the new entity.
         * templateRef of the new entity will be the node.id we just clicked on in the modal treeview.
         *
         * figure out how to get the node of the
         * */
      }}
    >
      {node.title}
    </div>
  )
}

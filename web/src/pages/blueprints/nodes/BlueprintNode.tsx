import React from 'react'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import {
  LayoutComponents,
  LayoutContext,
} from '../../common/golden-layout/LayoutContext'

type Props = {
  node: TreeNodeData
}

export const BlueprintNode = (props: Props) => {
  const { node } = props

  /*
    const openBlueprint = () => {
        const newItemConfig = {
            title: node.title,
            id: node.nodeId,
            type: 'react-component',
            component: 'blueprintItem',
            props: {
                selectedDocumentId: node.nodeId,
            },
        }
        const isAlreadyOpened =
            layout.myLayout.root.getItemsById(node.nodeId).length > 0
        if (!isAlreadyOpened) {
            layout.myLayout.root.contentItems[0].addChild(newItemConfig)
        }
        // dispatch(DocumentActions.viewFile(node.id))
    }*/

  return (
    <LayoutContext.Consumer>
      {(value: any) => {
        const data = {
          selectedDocumentId: node.nodeId,
        }
        return (
          <div
            onClick={() =>
              value.add(
                node.nodeId,
                node.title,
                LayoutComponents.blueprint,
                data
              )
            }
          >
            {node.title}
          </div>
        )
      }}
    </LayoutContext.Consumer>
  )
}

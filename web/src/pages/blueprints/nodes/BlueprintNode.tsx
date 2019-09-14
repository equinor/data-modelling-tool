import React from 'react'
import { TreeNodeData } from '../../../components/tree-view/Tree'

type Props = {
  node: TreeNodeData
  dispatch: Function
  layout: any
}

export const BlueprintNode = (props: Props) => {
  const { node, layout } = props

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
  }

  return <div onClick={openBlueprint}>{node.title}</div>
}

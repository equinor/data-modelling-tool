import React from 'react'
import { IndexNode } from '../../../api/Api'

type Props = {
  node: IndexNode
  dispatch: Function
  layout: any
  state: any
  datasource: any
}

export const BlueprintNode = (props: Props) => {
  const { node, dispatch, layout, state, datasource } = props

  const openBlueprint = () => {
    const newItemConfig = {
      title: node.title,
      type: 'react-component',
      component: 'blueprintItem',
      props: {
        selectedDocumentId: node.id,
        currentDatasourceId: datasource.id,
      },
    }
    // TODO: should check that this document is not already opened
    layout.myLayout.root.contentItems[0].addChild(newItemConfig)
    // dispatch(DocumentActions.viewFile(node.id))
  }

  return <div onClick={openBlueprint}>{node.title}</div>
}

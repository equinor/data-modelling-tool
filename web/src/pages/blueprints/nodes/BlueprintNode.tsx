import React from 'react'
import { DocumentActions } from '../../common/DocumentReducer'
import { IndexNode } from '../../../api/Api'

type Props = {
  node: IndexNode
  dispatch: Function
  layout: any
  state: any
}

export const BlueprintNode = (props: Props) => {
  const { node, dispatch, layout, state } = props

  console.log(layout)

  const openBlueprint = () => {
    const newItemConfig = {
      title: node.title,
      type: 'react-component',
      component: 'blueprintItem',
      props: {
        node: node,
        parentState: state,
        dispatch,
      },
    }

    layout.myLayout.root.contentItems[0].addChild(newItemConfig)
    /*
    layout.myLayout.root.contentItems[0].addChild({
      title: "Is new Tab",
      type: "react-component",
      component: "testItem"
    });*/

    dispatch(DocumentActions.viewFile(node.id))
  }

  return <div onClick={openBlueprint}>{node.title}</div>
}

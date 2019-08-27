import React from 'react'
import { BlueprintActions } from '../../BlueprintReducer'
import { IndexNode } from '../../../../api/Api'

type Props = {
  node: IndexNode
  dispatch: Function
}

export const BlueprintNode = (props: Props) => {
  const { node, dispatch } = props

  const openBlueprint = () => {
    dispatch(BlueprintActions.viewFile(node._id))
  }

  return <div onClick={openBlueprint}>{node.title}</div>
}

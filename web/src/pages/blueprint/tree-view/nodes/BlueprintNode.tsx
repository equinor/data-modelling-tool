import React from 'react'
import { BlueprintActions } from '../../BlueprintReducer'

export const BlueprintNode = (props: any) => {
  const { node, dispatch } = props

  const openBlueprint = () => {
    dispatch(BlueprintActions.viewFile(node.nodeId))
  }

  return <div onClick={openBlueprint}>{node.title}</div>
}

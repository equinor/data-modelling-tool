import React from 'react'
import { DocumentActions } from '../../common/DocumentReducer'
import { IndexNode } from '../../../api/Api'

type Props = {
  node: IndexNode
  dispatch: Function
}

export const BlueprintNode = (props: Props) => {
  const { node, dispatch } = props

  const openBlueprint = () => {
    dispatch(DocumentActions.viewFile(node._id))
  }

  return <div onClick={openBlueprint}>{node.title}</div>
}

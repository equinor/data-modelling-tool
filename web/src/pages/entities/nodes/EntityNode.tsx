import React from 'react'
import { DocumentActions } from '../../common/DocumentReducer'
import { IndexNode } from '../../../api/Api'

type Props = {
  node: IndexNode
  dispatch: Function
}

export const EntityNode = (props: Props) => {
  const { node, dispatch } = props

  const open = () => {
    dispatch(DocumentActions.viewFile(node.id))
  }

  return <div onClick={open}>{node.title}</div>
}

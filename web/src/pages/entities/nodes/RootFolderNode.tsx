import React from 'react'
import { RenderProps } from '../../common/tree-view/DocumentTree'

export const RootFolderNode = (props: RenderProps) => {
  const { treeNodeData } = props

  return <div>{treeNodeData.title}</div>
}

import React from 'react'
import { RenderProps } from '../../common/tree-view/DocumentTree'
import Api2 from '../../../api/Api2'
import { NodeType } from '../../../api/types'

export default ({
  treeNodeData,
  parent,
  replaceNode,
  updateNode,
}: RenderProps) => {
  const onClick = () => {
    const [dataSourceId, parentId] = parent.split('/')
    console.log(treeNodeData)
    Api2.addBlueprintFile({
      dataSourceId,
      filename: treeNodeData.title,
      parentId,
      templateRef: treeNodeData.templateRef,
      onSuccess: (res: any) => {
        replaceNode(parent, treeNodeData.nodeId, res.id, res.filename)

        console.log(res)
      },
    })
  }

  return <div onClick={onClick}>{treeNodeData.title}</div>
}

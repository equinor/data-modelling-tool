import { Datasource } from '../../api/Api'
import { DocumentsState } from '../common/DocumentReducer'
import React from 'react'
import DocumentTree, {
  AddNode,
  RenderProps,
} from '../common/tree-view/DocumentTree'
import { TreeNodeData } from '../../components/tree-view/Tree'
import { NodeType } from '../../api/types'
import { SelectBlueprintNode } from './nodes/EntityNode'

type Props = {
  datasources: Datasource[]
  state: DocumentsState
  sourceNode?: TreeNodeData
  addNode: AddNode
  newFileName: string
}

export default (props: Props) => {
  const { datasources, sourceNode, addNode, newFileName } = props
  return (
    <DocumentTree
      render={(renderProps: RenderProps) => {
        const { treeNodeData } = renderProps
        if (treeNodeData.nodeType === NodeType.file && sourceNode) {
          return (
            <SelectBlueprintNode
              {...renderProps}
              addNode={addNode}
              sourceNode={sourceNode}
              newFileName={newFileName}
            />
          )
        }
        // all other nodes should not have context menu.
        return <div>{treeNodeData.title}</div>
      }}
      dataSources={datasources}
    />
  )
}

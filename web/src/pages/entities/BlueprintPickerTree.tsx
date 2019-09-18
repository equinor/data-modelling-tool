import { Datasource } from '../../api/Api'
import { DocumentsAction, DocumentsState } from '../common/DocumentReducer'
import React from 'react'
import DocumentTree, { RenderProps } from '../common/tree-view/DocumentTree'
import { RootFolderNode } from './nodes/RootFolderNode'
import { FolderNode } from './nodes/FolderNode'
import { SelectBlueprintNode } from './nodes/EntityNode'
import { TreeNodeData } from '../../components/tree-view/Tree'
import { DataSourceNode } from '../blueprints/nodes/DataSourceNode'
import { NodeType } from '../../api/types'

type Props = {
  datasources: Datasource[]
  state: DocumentsState
  dispatch: (action: DocumentsAction) => void
  sourceNode?: TreeNodeData
}

export default (props: Props) => {
  const { datasources, state, dispatch, sourceNode } = props

  //@todo use render props
  return (
    <DocumentTree
      render={(renderProps: RenderProps) => {
        const { treeNodeData } = renderProps
        const NodeComponent = getNodeComponent(treeNodeData)
        return (
          <NodeComponent
            treeNodeData={treeNodeData}
            dispatch={dispatch}
            state={state}
            sourceNode={sourceNode}
          />
        )
      }}
      dataSources={datasources}
    />
  )
}

function getNodeComponent(treeNodeData: TreeNodeData): any {
  switch (treeNodeData.nodeType) {
    case NodeType.rootPackage:
      return RootFolderNode
    case NodeType.subPackage:
      return FolderNode
    case NodeType.file:
      return SelectBlueprintNode
    case NodeType.datasource:
      return DataSourceNode
    default:
      return () => <div>{treeNodeData.title}</div>
  }
}

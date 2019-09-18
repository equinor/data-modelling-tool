import { Datasource } from '../../api/Api'
import { DocumentsAction, DocumentsState } from '../common/DocumentReducer'
import React from 'react'
import DocumentTree, { RenderProps } from '../common/tree-view/DocumentTree'
import { RootFolderNode } from './nodes/RootFolderNode'
import { FolderNode } from './nodes/FolderNode'
import { SelectBlueprintNode } from './nodes/EntityNode'
import { TreeNodeData } from '../../components/tree-view/Tree'

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

function getNodeComponent(node: TreeNodeData): any {
  switch (node.nodeType) {
    case 'folder':
      if (node.isRoot) {
        return RootFolderNode
      } else {
        return FolderNode
      }
    case 'file':
      // override Node. Add an entity to the first tree based on selected blueprint.
      return SelectBlueprintNode
    default:
      return () => <div>{node.title}</div>
  }
}

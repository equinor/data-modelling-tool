import { Datasource, IndexNode } from '../../api/Api'
import { DocumentsAction, DocumentsState } from '../common/DocumentReducer'
import React from 'react'
import DocumentTree from '../common/tree-view/DocumentTree'
import { RootFolderNode } from './nodes/RootFolderNode'
import { FolderNode } from './nodes/FolderNode'
import { EntityNode } from './nodes/EntityNode'
import { TreeNodeData } from '../../components/tree-view/Tree'

export type OnNodeSelect = (node: TreeNodeData) => void

type Props = {
  datasources: Datasource[]
  state: DocumentsState
  dispatch: (action: DocumentsAction) => void
  onNodeSelect: OnNodeSelect
}

export default (props: Props) => {
  const { datasources, state, dispatch, onNodeSelect } = props
  return (
    <DocumentTree
      state={state}
      dispatch={dispatch}
      onNodeSelect={onNodeSelect}
      dataSources={datasources}
      getNodeComponent={getNodeComponent}
    />
  )
}

function getNodeComponent(node: IndexNode) {
  switch (node.nodeType) {
    case 'folder':
      if (node.isRoot) {
        return RootFolderNode
      } else {
        return FolderNode
      }
    case 'file':
      return EntityNode
    default:
      return () => <div>{node.title}</div>
  }
}

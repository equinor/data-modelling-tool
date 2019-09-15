import { Datasource, IndexNode } from '../../api/Api'
import { DocumentsAction, DocumentsState } from '../common/DocumentReducer'
import React from 'react'
import Header from '../../components/Header'
import DocumentTree from '../common/tree-view/DocumentTree'
import { RootFolderNode } from './nodes/RootFolderNode'
import { FolderNode } from './nodes/FolderNode'
import { EntityNode } from './nodes/EntityNode'
import { TreeNodeData } from '../../components/tree-view/Tree'

export type OnNodeSelect = (node: TreeNodeData) => void

type Props = {
  datasource: Datasource | undefined
  datasources: Datasource[]
  state: DocumentsState
  dispatch: (action: DocumentsAction) => void
  onNodeSelect: OnNodeSelect
}

export default (props: Props) => {
  const { datasource, datasources, state, dispatch, onNodeSelect } = props
  if (!datasource) {
    return null
  }
  return (
    <div>
      <Header>
        <div>{datasource.name}</div>
      </Header>
      <DocumentTree
        state={state}
        dispatch={dispatch}
        onNodeSelect={onNodeSelect}
        dataSources={datasources}
        getNodeComponent={getNodeComponent}
      />
    </div>
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

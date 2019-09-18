import { Datasource } from '../../api/Api'
import { DocumentsAction, DocumentsState } from '../common/DocumentReducer'
import React from 'react'
import DocumentTree, { RenderProps } from '../common/tree-view/DocumentTree'
import { RootFolderNode } from './nodes/RootFolderNode'
import { EntityNode, SelectBlueprintNode } from './nodes/EntityNode'
import { TreeNodeData } from '../../components/tree-view/Tree'
import { DataSourceNode } from '../blueprints/nodes/DataSourceNode'
import { NodeType } from '../../api/types'
import { FolderNode } from '../blueprints/nodes/FolderNode'

type Props = {
  datasources: Datasource[]
  state: DocumentsState
  dispatch: (action: DocumentsAction) => void
  sourceNode?: TreeNodeData
}

export default (props: Props) => {
  const { datasources, state, sourceNode } = props
  return (
    <DocumentTree
      render={(renderProps: RenderProps) => {
        const { treeNodeData } = renderProps
        switch (renderProps.treeNodeData.nodeType) {
          case NodeType.rootPackage:
            return <RootFolderNode {...renderProps} />
          case NodeType.subPackage:
            return <FolderNode {...renderProps} />
          case NodeType.file:
            if (sourceNode) {
              return (
                <SelectBlueprintNode {...renderProps} sourceNode={sourceNode} />
              )
            } else {
              return <EntityNode {...renderProps} />
            }
          case NodeType.datasource:
            return <DataSourceNode {...renderProps} state={state} />
          default:
            return () => <div>{treeNodeData.title}</div>
        }
      }}
      dataSources={datasources}
    />
  )
}

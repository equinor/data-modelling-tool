import { Datasource } from '../../api/Api'
import { DocumentsState } from '../common/DocumentReducer'
import React from 'react'
import DocumentTree, {
  AddNode,
  RenderProps,
} from '../common/tree-view/DocumentTree'
import { NodeType } from '../../api/types'
import { SelectBlueprintNode } from './nodes/EntityNode'
import { SetShowModal } from '../common/context-menu-actions/WithContextMenu'
import { TreeNodeData } from '../../components/tree-view/types'

type Props = {
  datasources: Datasource[]
  state: DocumentsState
  sourceNode?: TreeNodeData
  addNode: AddNode
  newFileName: string
  setShowModal: SetShowModal
}

export default (props: Props) => {
  const { datasources, sourceNode, addNode, newFileName, setShowModal } = props

  return (
    <DocumentTree
      render={(renderProps: RenderProps) => {
        const { treeNodeData } = renderProps
        if (treeNodeData.nodeType === NodeType.DOCUMENT_NODE && sourceNode) {
          return (
            <SelectBlueprintNode
              {...renderProps}
              addNode={addNode}
              sourceNode={sourceNode}
              newFileName={newFileName}
              setShowModal={setShowModal}
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

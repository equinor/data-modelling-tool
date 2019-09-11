import React, { useEffect, useState } from 'react'
import Tree, { TreeNodeData } from '../../../components/tree-view/Tree'
import { Datasource, IndexApi, IndexNode } from '../../../api/Api'
import { DocumentsAction, DocumentsState } from '../DocumentReducer'

const api = new IndexApi()

interface PropTypes {
  dispatch: (action: DocumentsAction) => void
  onNodeSelect: (node: TreeNodeData) => void
  state: any
  datasource: Datasource
  getNodeComponent: Function
}

export type AddNode = (node: TreeNodeData, parentId: string) => void
export type UpdateNode = (node: TreeNodeData) => void

interface NodeComponentCallbackProps {
  addNode: AddNode
  updateNode: UpdateNode
  node: TreeNodeData
}

export interface NodeComponentProps extends NodeComponentCallbackProps {
  documentState?: DocumentsState
  dispatch?: Function
  datasource: Datasource
}

export default (props: PropTypes) => {
  const { dispatch, state, datasource, onNodeSelect, getNodeComponent } = props
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState({})

  //not use useFetch hook because response should be dispatched to the reducer.
  useEffect(() => {
    async function fetchData() {
      const documents = await api.get(datasource)
      setDocuments(documents)
      setLoading(false)
    }

    setLoading(true)
    fetchData()
  }, [datasource])

  if (loading) {
    return <div>Loading...</div>
  }
  if (!Object.keys(documents).length && datasource.id !== 'local') {
    return null
  }

  return (
    <div>
      <div>
        <Tree tree={documents} onNodeSelect={onNodeSelect}>
          {(node: IndexNode, addNode: Function, updateNode: Function) => {
            const NodeComponent = getNodeComponent(node)
            /**
             * pass NodeComponent down the render tree, to get access to the indexNode and treeActions. (addNode, updateNode)
             * The Tree only concern about displaying a TreeNode, while NodeComponent enhance a TreeNode's functionality.
             * e.g context menu and modal.
             */
            return (
              <NodeComponent
                state={state}
                dispatch={dispatch}
                addNode={addNode}
                updateNode={updateNode}
                node={node}
                datasource={datasource}
              ></NodeComponent>
            )
          }}
        </Tree>
      </div>
    </div>
  )
}

type DocumentTreeHeaderProps = {
  datasource: Datasource
  children?: any
}

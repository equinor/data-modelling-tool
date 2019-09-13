import React, { useEffect, useState } from 'react'
import Tree, { TreeNodeData } from '../../../components/tree-view/Tree'
import { Datasource, IndexApi, IndexNode } from '../../../api/Api'
import { DocumentsAction, DocumentsState } from '../DocumentReducer'

const api = new IndexApi()

interface PropTypes {
  dispatch: (action: DocumentsAction) => void
  state: any
  dataSources: Datasource[]
  getNodeComponent: Function
  layout?: any
  onNodeSelect?: (node: TreeNodeData) => void
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
  datasource?: any
}

export default (props: PropTypes) => {
  const {
    dispatch,
    state,
    dataSources,
    onNodeSelect,
    getNodeComponent,
    layout,
  } = props
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState({})

  useEffect(() => {
    const getDataSource = async (dataSource: Datasource) => {
      return await api.get(dataSource)
    }
    const getAllDataSources = async () => {
      return await Promise.all(
        dataSources.map(dataSource => getDataSource(dataSource))
      )
    }
    setLoading(true)
    getAllDataSources().then(values => {
      const allDocuments = values.reduce((obj, item) => {
        return {
          ...obj,
          ...item,
        }
      }, {})
      setDocuments(allDocuments)
      setLoading(false)
    })
  }, [dataSources])

  if (loading) {
    return <div>Loading...</div>
  }
  if (!Object.keys(documents).length) {
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
                layout={layout}
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

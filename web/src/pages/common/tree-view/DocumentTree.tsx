import React, { useEffect, useState } from 'react'
import Tree, { TreeNodeData } from '../../../components/tree-view/Tree'
import axios from 'axios'
import { Datasource, DmtApi, IndexNode } from '../../../api/Api'
import values from 'lodash/values'
import { DocumentsAction, DocumentsState } from '../DocumentReducer'
import FileUpload from './FileUpload'

const api = new DmtApi()

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
  state?: DocumentsState
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
      axios(api.indexGet(datasource.id))
        .then(res => {
          const nodes = values(res.data)
          const documents = nodes
            .map(node => {
              return {
                ...node,
                nodeId: node.id,
                isOpen: false,
              }
            })
            .reduce((obj, item) => {
              obj[item.nodeId] = item
              return obj
            }, {})
          setDocuments(documents)
        })
        .catch((err: any) => {
          console.error(err)
        })
      setLoading(false)
    }

    setLoading(true)
    fetchData()
  }, [datasource.id])

  if (loading) {
    return <div>Loading...</div>
  }
  if (!Object.keys(documents).length) {
    return null
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-flex' }}>
          <h3>{datasource.name}</h3>
        </div>
        <div style={{ display: 'inline-flex' }}>
          <FileUpload state={state} dispatch={dispatch} />
        </div>
      </div>
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

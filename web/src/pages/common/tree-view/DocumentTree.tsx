import React, { useEffect, useState } from 'react'
import Tree, { TreeNodeData } from '../../../components/tree-view/Tree'
import { Datasource, DmtApi, IndexApi, IndexNode } from '../../../api/Api'
import { DocumentsAction, DocumentsState } from '../DocumentReducer'
import genereteFakeTree from '../../../util/genereteFakeTree'
import axios from 'axios'
import { NodeType } from '../../../components/tree-view/TreeReducer'
import { TreeNodeBuilder } from './TreeNodeBuilder'

const api = new IndexApi()
const apiTargets = new DmtApi()

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
      // values = [...values, genereteFakeTree()]
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

  const handleDrag = (source: any, destination: any) => {
    console.log('SOURCE', source)
    console.log('DEST', destination)
    // @ts-ignore
    const item = documents[source.nodeId]
    console.log(item)
    console.log(source)

    if (item.nodeType == NodeType.file) {
      const sourceUrl = apiTargets.documentGet(source.nodeId) as string
      axios
        // We need to get formData
        .get(sourceUrl)
        .then((result: any) => {
          const formData = result.data
          delete formData['_id']

          // Add document to this package
          const parentId = destination.parentId.substring(
            destination.parentId.indexOf('/') + 1
          )

          // Destination data source
          const destinationDataSourceId = destination.parentId.split('/')[0]
          axios
            .post(apiTargets.packagePost(destinationDataSourceId), {
              nodeType: item.nodeType,
              isRoot: item.isRoot,
              parentId: parentId,
              formData: result.data,
            })
            .then(res => {
              // Add document to this package
              const id = source.nodeId.substring(source.nodeId.indexOf('/') + 1)
              const sourceDataSourceId = source.nodeId.split('/')[0]
              // Remove document from this package
              const sourceParentId = source.parentId.substring(
                source.parentId.indexOf('/') + 1
              )

              const position = id.lastIndexOf('/')
              let title = id.substring(position + 1)
              title = title.substring(0, title.length - 5)

              const data = {
                id: id,
                nodeType: item.nodeType,
                parentId: sourceParentId,
                isRoot: item.isRoot,
                formData: {
                  title: title,
                },
              }
              console.log(data)
              axios.delete(apiTargets.packagePost(sourceDataSourceId), {
                data: data,
              })
            })
            .catch(err => {
              console.log(Object.keys(err))
            })
        })
    }
  }

  return (
    <div>
      <div>
        <Tree
          tree={documents}
          onNodeSelect={onNodeSelect}
          isDragEnabled={true}
          onDrag={handleDrag}
        >
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

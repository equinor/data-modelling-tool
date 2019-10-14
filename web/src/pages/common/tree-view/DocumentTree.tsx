import React, { useEffect, useState } from 'react'
import Tree from '../../../components/tree-view/Tree'
import { Datasource, IndexApi } from '../../../api/Api'
import { TreeNodeData } from '../../../components/tree-view/types'

const api = new IndexApi()

interface PropTypes {
  dataSources: Datasource[]
  render: Function
}

export type AddNode = (node: TreeNodeData, parentId: string) => void
export type UpdateNode = (node: TreeNodeData) => void
export type RemoveNode = (node: TreeNodeData) => void
export type ReplaceNode = (
  parentId: string,
  oldId: string,
  newId: string,
  title: string
) => void

export type RenderProps = {
  path: string
  parent: string
  treeNodeData: TreeNodeData
  addNode: AddNode
  updateNode: UpdateNode
  removeNode: RemoveNode
  replaceNode: ReplaceNode
}

export default (props: PropTypes) => {
  const { dataSources, render } = props
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
        <Tree tree={documents}>
          {(
            path: string,
            parent: string,
            treeNodeData: TreeNodeData,
            addNode: AddNode,
            updateNode: UpdateNode,
            removeNode: RemoveNode,
            replaceNode: ReplaceNode
          ) => {
            return render({
              path,
              parent,
              treeNodeData,
              addNode,
              updateNode,
              removeNode,
              replaceNode,
            })
          }}
        </Tree>
      </div>
    </div>
  )
}

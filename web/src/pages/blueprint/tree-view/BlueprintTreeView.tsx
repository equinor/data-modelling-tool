import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Tree from '../../../components/tree-view/Tree'
import { BlueprintAction, BlueprintState } from '../BlueprintReducer'
import { RootFolderNode } from './nodes/DataSourceNode'
import { FolderNode } from './nodes/FolderNode'
import { BlueprintNode } from './nodes/BlueprintNode'
import { IndexNode } from '../../../api/Api'

interface PropTypes {
  dispatch: (action: BlueprintAction) => void
  state: BlueprintState
  datasource: any
}

export default (props: PropTypes) => {
  const { dispatch, datasource } = props
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState({})

  useEffect(() => {
    async function fetchData() {
      const urlBluePrints = `/api/index/${datasource._id}`
      axios(urlBluePrints)
        .then(res => {
          setDocuments(res.data)
        })
        .catch((err: any) => {
          console.error(err)
        })
      setLoading(false)
    }

    setLoading(true)
    fetchData()
  }, [datasource._id])

  if (loading) {
    return <div>Loading...</div>
  }
  if (!Object.keys(documents).length) {
    return null
  }
  return (
    <div>
      <h3>{datasource.name}</h3>
      <div>
        <Tree tree={documents}>
          {(node: IndexNode, addNode: Function, updateNode: Function) => {
            const NodeComponent = getNodeComponent(node)
            return (
              <NodeComponent
                dispatch={dispatch}
                addNode={addNode}
                updateNode={updateNode}
                node={node}
              ></NodeComponent>
            )
          }}
        </Tree>
      </div>
    </div>
  )
}

function getNodeComponent(node: IndexNode) {
  switch (node.nodeType) {
    case 'root-package':
      return RootFolderNode
    case 'package':
      return FolderNode
    case 'file':
      return BlueprintNode
    default:
      return () => <div>{node.title}</div>
  }
}

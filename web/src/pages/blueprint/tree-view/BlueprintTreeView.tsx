import React, { useEffect } from 'react'
import axios from 'axios'
import Tree from '../../../components/tree-view/Tree'
import {
  BlueprintAction,
  BlueprintActions,
  BlueprintState,
} from '../BlueprintReducer'
import BlueprintTreeviewHeader from './BlueprintTreeviewHeader'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { RootFolderNode } from './nodes/DataSourceNode'
import { FolderNode } from './nodes/FolderNode'
import { BlueprintNode } from './nodes/BlueprintNode'

interface PropTypes {
  dispatch: (action: BlueprintAction) => void
  state: BlueprintState
}

export default (props: PropTypes) => {
  const { state, dispatch } = props

  const urlBluePrints = '/api/index/blueprints'
  useEffect(() => {
    async function fetchData() {
      const responseBlueprints = await axios(urlBluePrints)
      dispatch(BlueprintActions.addNodes(responseBlueprints.data))
    }

    fetchData()
  }, [urlBluePrints, dispatch])

  return (
    <div>
      <BlueprintTreeviewHeader state={state} dispatch={dispatch} />

      <div>
        <Tree tree={state.nodes}>
          {(node: TreeNodeData, addNode: Function, updateNode: Function) => {
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

function getNodeComponent(node: TreeNodeData) {
  const versionTest = new RegExp(/\d+.\d+.\d+/)
  let isParentOfVersion = false
  node.children &&
    node.children.forEach(childPath => {
      const childPathTitle = childPath.substr(childPath.lastIndexOf('/') + 1)
      if (versionTest.test(childPathTitle)) {
        isParentOfVersion = true
      }
    })
  if (isParentOfVersion) {
    return () => <div>{node.title}</div>
  }

  switch (node.type) {
    case 'folder':
      return node.isRoot ? RootFolderNode : FolderNode
    case 'file':
      return BlueprintNode
    default:
      return () => <div>{node.title}</div>
  }
}

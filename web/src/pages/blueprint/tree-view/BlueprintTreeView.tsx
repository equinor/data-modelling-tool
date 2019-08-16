import React, { useEffect } from 'react'
import axios from 'axios'
import Tree from '../../../components/tree-view/Tree'
import SearchTree from '../../../components/tree-view/SearchTree'
import FormModal from './FormModal'
import {
  BlueprintAction,
  BlueprintActions,
  BlueprintState,
} from '../BlueprintReducer'
import BlueprintTreeviewHeader from './BlueprintTreeviewHeader'
import {
  BlueprintNode,
  FolderNode,
  RootFolderNode,
} from './BlueprintTreeViewNode'
import { TreeNodeType } from '../../../components/tree-view/TreeNode'

interface PropTypes {
  dispatch: (action: BlueprintAction) => {}
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
  }, [urlBluePrints, dispatch]) // empty array

  const onToggle = (node: TreeNodeType): void => {
    dispatch(BlueprintActions.toggleNode(node.path))
  }

  return (
    <div>
      <BlueprintTreeviewHeader state={state} dispatch={dispatch} />

      <FormModal dispatch={dispatch} state={state} />

      <div>
        <div>
          <SearchTree
            onChange={(value: string) =>
              dispatch(BlueprintActions.filterTree(value))
            }
          />
        </div>
        <Tree tree={state.nodes} onToggle={onToggle}>
          {(node: TreeNodeType) => {
            const NodeComponent = getNodeComponent(node)
            return (
              <NodeComponent dispatch={dispatch} node={node}></NodeComponent>
            )
          }}
        </Tree>
      </div>
    </div>
  )
}

function getNodeComponent(node: TreeNodeType) {
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

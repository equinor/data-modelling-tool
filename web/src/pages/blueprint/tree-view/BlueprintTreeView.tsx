import React, { useEffect } from 'react'
import axios from 'axios'
import { BlueprintTreeViewActions } from './BlueprintTreeViewReducer'
import Tree, { TreeNodeType } from '../../../components/tree-view/TreeNode'
import SearchTree from '../../../components/tree-view/SearchTree'
import FormModal from './FormModal'
import {
  BlueprintAction,
  BlueprintActions,
  BlueprintState,
} from '../BlueprintReducer'
import BlueprintTreeviewHeader from './BlueprintTreeviewHeader'
import { BlueprintNode, FolderNode } from './BlueprintTreeViewNode'

interface PropTypes {
  dispatch: (action: BlueprintAction) => void
  state: BlueprintState
  dispatchTreeview: (action: object) => void
  stateTreeview: object
}

export default (props: PropTypes) => {
  const { stateTreeview, dispatchTreeview, state, dispatch } = props

  // back compatibility. remove later.
  const setAction = (value: string) =>
    dispatch(BlueprintActions.setAction(value))
  const setOpen = (value: boolean) => dispatch(BlueprintActions.setOpen(value))

  const urlBluePrints = '/api/index/blueprints'
  useEffect(() => {
    async function fetchData() {
      const responseBlueprints = await axios(urlBluePrints)
      dispatchTreeview(
        BlueprintTreeViewActions.addAssets(
          responseBlueprints.data,
          urlBluePrints.replace('/index', '')
        )
      )
    }

    fetchData()
  }, [urlBluePrints, dispatchTreeview]) // empty array

  const onToggle = (node: TreeNodeType): void => {
    dispatchTreeview(BlueprintTreeViewActions.toggleNode(node.path))
  }

  return (
    <div>
      <BlueprintTreeviewHeader
        state={state}
        dispatch={dispatch}
        onCreatePackage={() => {
          setAction('add-package')
          setOpen(true)
        }}
      />

      <FormModal
        dispatchTreeview={dispatchTreeview}
        dispatch={dispatch}
        state={state}
      />

      <div>
        <div>
          <SearchTree
            onChange={(value: string) =>
              dispatchTreeview(BlueprintTreeViewActions.filterTree(value))
            }
          />
        </div>
        <Tree tree={stateTreeview} onToggle={onToggle}>
          {(node: TreeNodeType) => {
            switch (node.type) {
              case 'folder':
                return <FolderNode dispatch={dispatch} node={node} />
              case 'file':
                return <BlueprintNode dispatch={dispatch} node={node} />
              default:
                return <div>{node.title}</div>
            }
          }}
        </Tree>
      </div>
    </div>
  )
}

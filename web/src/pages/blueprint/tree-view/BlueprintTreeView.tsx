import React, { useEffect } from 'react'
import axios from 'axios'
import values from 'lodash/values'
import { BlueprintTreeViewActions } from './BlueprintTreeViewReducer'
import TreeNode, {
  MenuItem,
  TreeNodeType,
} from '../../../components/tree-view/TreeNode'
import SearchTree from '../../../components/tree-view/SearchTree'
import FormModal from './FormModal'
import {
  BlueprintAction,
  BlueprintActions,
  BlueprintState,
  PageMode,
} from '../BlueprintReducer'
import BlueprintTreeviewHeader from './BlueprintTreeviewHeader'

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
  const setNodePath = (value: string) =>
    dispatch(BlueprintActions.setSelectedBlueprintId(value))

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

  const rootNodes = values(stateTreeview).filter((n: TreeNodeType) => n.isRoot)

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
        {rootNodes
          .filter((node: TreeNodeType) => !node.isHidden)
          .map((node: TreeNodeType) => {
            /**
             * The properies hide* and only* controls when choices are visible.
             *
             * @type {*[]}
             */
            const menuItems: MenuItem[] = [
              {
                type: 'folder',
                action: 'create-blueprint',
                label: 'Create Blueprint',
                hideRoot: true,
              },
              {
                type: 'folder',
                action: 'add-subpackage',
                label: 'Create SubPackage',
                hideRoot: true,
              },
              {
                type: 'folder',
                action: 'edit-package',
                label: 'Edit Package',
                hideRoot: true,
                onlyVersion: true,
              },
              {
                type: 'folder',
                action: 'edit-subpackage',
                label: 'Edit Sub Package',
                hideRoot: true,
                hideVersion: true,
              },
            ]

            return (
              <TreeNode
                key={node.path}
                level={0}
                node={node}
                nodes={stateTreeview}
                onToggle={onToggle}
                menuItems={menuItems}
                onClickContextMenu={(id, action) => {
                  switch (action) {
                    case 'create-blueprint':
                      dispatch(BlueprintActions.setSelectedBlueprintId(id))
                      dispatch(BlueprintActions.setPageMode(PageMode.create))
                      break
                    case 'add-package':
                      setNodePath(id)
                      setAction(action)
                      setOpen(true)
                      break
                    case 'add-subpackage':
                      setAction(action)
                      setNodePath(id)
                      setOpen(true)
                      break
                    case 'edit-package':
                      setAction(action)
                      setNodePath(id)
                      setOpen(true)
                      break
                    case 'edit-subpackage':
                      setAction(action)
                      setNodePath(id)
                      setOpen(true)
                      break
                    default:
                      setAction('clear')
                      console.error('action not supported: ', action, id)
                  }
                }}
                onNodeSelect={(node: TreeNodeType) => {
                  if (node.type === 'file') {
                    dispatch(BlueprintActions.setSelectedBlueprintId(node.path))
                    dispatch(BlueprintActions.setPageMode(PageMode.view))
                  }
                }}
              />
            )
          })}
      </div>
    </div>
  )
}

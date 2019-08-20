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
import { BlueprintActions, BlueprintState, PageMode } from '../BlueprintReducer'
import BlueprintTreeviewHeader from './BlueprintTreeviewHeader'

interface PropTypes {
  dispatch: (action: any) => void
  state: BlueprintState
}

export default (props: PropTypes) => {
  const { state, dispatch } = props

  console.log(state)
  // back compatibility. remove later.
  const setAction = (value: string) => {
    // dispatch(BlueprintActions.setAction(value))
  }
  const setOpen = (value: boolean) => {
    // dispatch(BlueprintActions.setOpen(value))
  }
  const setNodePath = (value: string) => {}
  // dispatch(BlueprintActions.setSelectedBlueprintId(value))

  const urlBluePrints = '/api/index/blueprints'
  useEffect(() => {
    async function fetchData() {
      const responseBlueprints = await axios(urlBluePrints)
      dispatch(BlueprintTreeViewActions.addAssets(responseBlueprints.data))
    }

    fetchData()
  }, [urlBluePrints, dispatch]) // empty array

  const onToggle = (node: TreeNodeType): void => {
    dispatch(BlueprintTreeViewActions.toggleNode(node.path))
  }

  const rootNodes = values(state.nodes).filter((n: any) => n.isRoot)
  console.log(rootNodes)

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
        {rootNodes
          .filter((node: any) => !node.isHidden)
          .map((node: any) => {
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
                nodes={state.nodes}
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

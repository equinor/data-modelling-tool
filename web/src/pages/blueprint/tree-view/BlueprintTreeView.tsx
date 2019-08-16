import React, { useEffect, useState } from 'react'
import axios from 'axios'
import values from 'lodash/values'
import Header from '../../../components/Header'
import { BlueprintTreeViewActions } from './BlueprintTreeViewReducer'
import TreeNode, {
  MenuItem,
  TreeNodeType,
} from '../../../components/tree-view/TreeNode'
import SearchTree from '../../../components/tree-view/SearchTree'

import Button from '../../../components/Button'
import FormModal from './FormModal'
import { PageMode } from '../BlueprintPage'

interface PropTypes {
  dispatch: (action: {}) => void
  state: object
  setPageMode: (pageMode: PageMode) => void
  setSelectedBlueprintId: (id: string) => void
}

export default (props: PropTypes) => {
  const { state, dispatch, setPageMode, setSelectedBlueprintId } = props
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('clear')
  const [nodePath, setNodePath] = useState('')

  const urlBluePrints = '/api/index/blueprints'
  useEffect(() => {
    async function fetchData() {
      const responseBlueprints = await axios(urlBluePrints)
      dispatch(
        BlueprintTreeViewActions.addAssets(
          responseBlueprints.data,
          urlBluePrints.replace('/index', '')
        )
      )
    }

    fetchData()
  }, [urlBluePrints, dispatch]) // empty array

  const onToggle = (node: TreeNodeType): void => {
    dispatch(BlueprintTreeViewActions.toggleNode(node.path))
  }

  const rootNodes = values(state).filter((n: TreeNodeType) => n.isRoot)

  return (
    <div>
      <Header>
        <h3>Blueprints</h3>
        <Button
          type="button"
          onClick={() => {
            setAction('add-package')
            setOpen(true)
          }}
        >
          Create Package
        </Button>
      </Header>

      <FormModal
        dispatch={dispatch}
        open={open}
        setOpen={setOpen}
        path={nodePath}
        action={action}
      />

      <div>
        <div>
          <SearchTree
            onChange={(value: string) =>
              dispatch(BlueprintTreeViewActions.filterTree(value))
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
                nodes={state}
                onToggle={onToggle}
                menuItems={menuItems}
                onClickContextMenu={(id, action) => {
                  switch (action) {
                    case 'create-blueprint':
                      setSelectedBlueprintId(id)
                      setPageMode(PageMode.create)
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
                    setSelectedBlueprintId(node.path)
                    setPageMode(PageMode.view)
                  }
                }}
              />
            )
          })}
      </div>
    </div>
  )
}

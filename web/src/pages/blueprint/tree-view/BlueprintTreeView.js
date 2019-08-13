import React, { useEffect, useState } from 'react'
import axios from 'axios'
import values from 'lodash/values'
import Header from '../../../components/Header'
import { BlueprintTreeViewActions } from './BlueprintTreeViewReducer'
import TreeNode from '../../../components/tree-view/TreeNode'
import SearchTree from '../../../components/tree-view/SearchTree'
import Modal from '../../../components/modal/Modal'
import Form from '../../../components/Form'
import Button from '../../../components/Button'
import CreatePackageModal from './modals/CreatePackageModal'
import CreateSubPackageModal from './modals/CreateSubpackageModal'

export default props => {
  const { state, dispatch, setEditMode, setSelectedBlueprintId } = props
  const [open, setOpen] = useState(false)
  const [nodeIdModal, setNodeIdModal] = useState(false)
  const [openRootPackage, setOpenRootPackage] = useState(false)

  const urlBlueprints = '/api/index/blueprints'
  useEffect(() => {
    async function fetchData() {
      const responseBlueprints = await axios(urlBlueprints)
      dispatch(
        BlueprintTreeViewActions.addAssets(
          responseBlueprints.data,
          urlBlueprints.replace('/index', '')
        )
      )
    }

    fetchData()
  }, [urlBlueprints, dispatch]) // empty array

  const onToggle = node => {
    dispatch(BlueprintTreeViewActions.toggleNode(node.path))
  }

  const addPackage = nodeId => {
    setNodeIdModal(nodeId)
    setOpen(true)
  }

  const rootNodes = values(state).filter(n => n.isRoot)
  return (
    <div>
      <Header>
        <h3>Blueprints</h3>
        <Button
          type="button"
          onClick={() => {
            setOpenRootPackage(true)
          }}
        >
          Create Package
        </Button>
      </Header>

      <CreatePackageModal
        {...props}
        open={openRootPackage}
        setOpen={setOpenRootPackage}
      />

      <CreateSubPackageModal
        {...props}
        open={open}
        path={nodeIdModal}
        setOpen={setOpen}
        callback={(path, title) => {
          setNodeIdModal(null)
          dispatch(BlueprintTreeViewActions.addPackage(path, title))
        }}
      />

      <div>
        <div>
          <SearchTree
            onChange={value =>
              dispatch(BlueprintTreeViewActions.filterTree(value))
            }
          />
        </div>
        {rootNodes
          .filter(node => !node.isHidden)
          .map(node => {
            /**
             * The properies hide* and only* controls when choices are visible.
             *
             * @type {*[]}
             */
            const menuItems = [
              {
                type: 'folder',
                action: 'create-blueprint',
                label: 'Create Blueprint',
                hideRoot: true,
              },
              {
                type: 'folder',
                action: 'add-package',
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
                action: 'edit-sub-package',
                label: 'Edit Sub Package',
                hideRoot: true,
                hideVersion: true,
              },
            ]

            return (
              <TreeNode
                key={node.path}
                node={node}
                nodes={state}
                existing={true}
                onToggle={onToggle}
                menuItems={menuItems}
                onClickContextMenu={(id, action) => {
                  switch (action) {
                    case 'add-package':
                      addPackage(id)
                      break
                    case 'create-blueprint':
                      setSelectedBlueprintId(id)
                      break
                    // case 'edit-package':
                    //@todo use modal.
                    // console.warn('not implemented.');
                    // setSelectedBlueprintId(id)
                    // break
                    default:
                      console.error('action not supported: ', action, id)
                  }
                }}
                onNodeSelect={node => {
                  if (node.type === 'file') {
                    setSelectedBlueprintId(node.path)
                    setEditMode(true)
                  }
                }}
              />
            )
          })}
      </div>
    </div>
  )
}

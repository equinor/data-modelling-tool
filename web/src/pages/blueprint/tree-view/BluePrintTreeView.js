import React, { useEffect, useState } from 'react'
import axios from 'axios'
import values from 'lodash/values'
import Header from '../../../components/Header'
import { FilesActions } from './BluePrintTreeViewReducer'
import TreeNode from '../../../components/tree-view/TreeNode'
import SearchTree from '../../../components/tree-view/SearchTree'
import Modal from '../../../components/modal/Modal'
import Form from '../../../components/Form'
import Button from '../../../components/Button'

export default props => {
  const { state, dispatch, setEditMode, setSelectedTemplateId } = props
  const [open, setOpen] = useState(false)
  const [nodeIdModal, setNodeIdModal] = useState(false)
  const [openRootPackage, setOpenRootPackage] = useState(false)

  const urlBluePrints = '/api/index/blueprints'
  useEffect(() => {
    async function fetchData() {
      const responseBlueprints = await axios(urlBluePrints)
      dispatch(
        FilesActions.addAssets(
          responseBlueprints.data,
          urlBluePrints.replace('/index', '')
        )
      )
    }

    fetchData()
  }, [urlBluePrints, dispatch]) // empty array

  const onToggle = node => {
    dispatch(FilesActions.toggleNode(node.path))
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
          dispatch(FilesActions.addPackage(path, title))
        }}
      />

      <div>
        <div>
          <SearchTree
            onChange={value => dispatch(FilesActions.filterTree(value))}
          />
        </div>
        {rootNodes
          .filter(node => !node.isHidden)
          .map(node => {
            const menuItems = [
              {
                isRoot: false,
                type: 'folder',
                action: 'create-blueprint',
                label: 'Create Blueprint',
              },
              {
                isRoot: false,
                type: 'folder',
                action: 'add-package',
                label: 'Create SubPackage',
              },
              {
                isRoot: false,
                type: 'folder',
                action: 'edit-package',
                label: 'Edit Package',
              },
              {
                isRoot: false,
                type: 'folder',
                action: 'edit-sub-package',
                label: 'Edit Sub Package',
                version: false,
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
                      setSelectedTemplateId(id)
                      break
                    case 'edit-package':
                      //@todo use modal.
                      // console.warn('not implemented.');
                      setSelectedTemplateId(id)
                      break
                    default:
                      console.error('action not supported: ', action, id)
                  }
                }}
                onNodeSelect={node => {
                  if (node.type === 'file') {
                    setSelectedTemplateId(node.path)
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

const CreatePackageModal = props => {
  const { setEditMode, open, setOpen, dispatch } = props
  return (
    <Modal toggle={() => setOpen(!open)} open={open}>
      <Form
        schemaUrl="/api/templates/package.json"
        onSubmit={formData => {
          axios
            .put(
              `/api/blueprints/${formData.title}/${formData.version}/package.json`,
              formData
            )
            .then(res => {
              dispatch(FilesActions.addRootPackage(res.data))
            })
            .catch(err => {
              console.log(err)
            })
          setOpen(false)
          setEditMode(false)
        }}
      ></Form>
    </Modal>
  )
}

const CreateSubPackageModal = props => {
  const { setEditMode, open, path, setOpen, callback } = props
  return (
    <Modal toggle={() => setOpen(!open)} open={open}>
      {path && (
        <Form
          schemaUrl="/api/templates/subpackage.json"
          onSubmit={formData => {
            const parent = path.replace('/package.json', '')
            axios
              .put(
                `/api/blueprints/${parent}/${formData.title}/package.json`,
                formData
              )
              .then(res => {
                setOpen(false)
                setEditMode(false)
                callback(res.data, formData.title)
              })
              .catch(err => {
                console.log(err)
              })
          }}
        ></Form>
      )}
    </Modal>
  )
}

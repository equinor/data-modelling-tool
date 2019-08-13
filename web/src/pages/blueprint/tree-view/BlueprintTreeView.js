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
  const [action, setAction] = useState('clear')
  const [nodePath, setNodePath] = useState('')

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

  const rootNodes = values(state).filter(n => n.isRoot)
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

      <Modal toggle={() => setOpen(!open)} open={open}>
        <Form
          {...getConfigByAction({ action, dispatch, setOpen, nodePath })}
        ></Form>
      </Modal>

      <div>
        <div>
          <SearchTree
            onChange={value => dispatch(FilesActions.filterTree(value))}
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
                node={node}
                nodes={state}
                existing={true}
                onToggle={onToggle}
                menuItems={menuItems}
                onClickContextMenu={(id, action) => {
                  switch (action) {
                    case 'create-blueprint':
                      setSelectedTemplateId(id)
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

function getConfigByAction(props) {
  switch (props.action) {
    case 'add-package':
      return addPackageConfig(props)
    case 'add-subpackage':
      return addSubPackageConfig(props)
    case 'edit-package':
      return editPackageConfig(props)
    case 'edit-subpackage':
      return editSubPackageConfig(props)
    case 'clear':
      break
    default:
      console.warn(props.action + ' is not supported.')
      return null
  }
}

function addPackageConfig(props) {
  const { dispatch, setOpen } = props
  return {
    schemaUrl: '/api/templates/package.json',
    dataUrl: '',
    onSubmit: formData => {
      console.log(formData)
      axios
        .put(
          `/api/blueprints/${formData.title}/${formData.version}/package.json`,
          formData
        )
        .then(res => {
          dispatch(FilesActions.addRootPackage(res.data))
          setOpen(false)
        })
        .catch(err => {
          console.log(err)
        })
    },
  }
}

function editPackageConfig(props) {
  const { setOpen, path } = props
  const dataUrl = '/api/blueprints/' + path
  return {
    schemaUrl: '/api/templates/package.json',
    dataUrl,
    onSubmit: formData => {
      axios
        .put(dataUrl, formData)
        .then(res => {
          // @todo use notification.
          // @todo editing title or version is not updating the tree.
          console.log(res.data + ' is updated.')
          setOpen(false)
        })
        .catch(err => {
          console.error(err)
        })
    },
  }
}

function addSubPackageConfig(props) {
  const { dispatch, setOpen, nodePath } = props
  return {
    schemaUrl: '/api/templates/subpackage.json',
    dataUrl: '',
    onSubmit: formData => {
      const url = `/api/blueprints/${nodePath.replace(
        'package.json',
        formData.title + '/package.json'
      )}`
      console.log(url)
      axios
        .put(url, formData)
        .then(res => {
          setOpen(false)
          dispatch(FilesActions.addPackage(res.data, formData.title))
        })
        .catch(err => {
          console.log(err)
        })
    },
  }
}

function editSubPackageConfig(props) {
  const { setOpen, nodePath } = props
  const dataUrl = '/api/blueprints/' + nodePath
  return {
    schemaUrl: '/api/templates/subpackage.json',
    dataUrl,
    onSubmit: formData => {
      axios
        .put(dataUrl, formData)
        .then(res => {
          setOpen(false)
        })
        .catch(err => {
          console.error(err)
        })
    },
  }
}

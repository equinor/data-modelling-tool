import React, { useState } from 'react'
import ContextMenu from '../../../../components/context-menu/ContextMenu'
import { NodeType } from '../../../../components/tree-view/TreeReducer'
import Form from '../../../../components/Form'
import Modal from '../../../../components/modal/Modal'
import axios from 'axios'
import { Props } from './DataSourceNode'

type WithContextMenuProps = {
  label: string
  menuItems: any[]
  id: string
  onClickContextMenu: any
}

const WithContextMenu = (props: WithContextMenuProps) => {
  const { label } = props
  return <ContextMenu {...props}>{label}</ContextMenu>
}

export function addPackageConfig(props: any) {
  const { onSuccess, onError, nodeId } = props
  let id = nodeId.substring(nodeId.indexOf('/') + 1)
  return {
    schemaUrl: '/api/templates/blueprint.json',
    dataUrl: '',
    onSubmit: (formData: any) => {
      axios
        .put(`/api/blueprints/${id}/${formData.title}.json`, formData)
        .then(res => {
          onSuccess(res.data)
        })
        .catch(err => {
          onError(err)
        })
    },
  }
}

function addSubPackageConfig(props: any) {
  const { onSuccess, onError, nodeId } = props
  let id = nodeId.substring(nodeId.indexOf('/') + 1)
  return {
    schemaUrl: '/api/templates/subpackage.json',
    dataUrl: '',
    onSubmit: (formData: any) => {
      const url = `/api/blueprints/${id}/${formData.title}/package.json`
      axios
        .put(url, formData)
        .then(res => {
          onSuccess(res.data)
        })
        .catch(err => {
          onError(err)
        })
    },
  }
}

function editSubPackageConfig(props: any) {
  const { onSuccess, onError, nodeId } = props
  let id = nodeId.substring(nodeId.indexOf('/') + 1)
  const dataUrl = `/api/blueprints/${id}/package.json`
  return {
    schemaUrl: '/api/templates/subpackage.json',
    dataUrl,
    onSubmit: (formData: any) => {
      axios
        .put(dataUrl, formData)
        .then(res => {
          onSuccess(res.data)
        })
        .catch(err => {
          onError(err)
        })
    },
  }
}

export type NodeMenuItem = {
  action: string
  label: string
}

export const FolderNode = (props: Props) => {
  const { node, addNode, updateNode } = props
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState('')
  const menuItems: NodeMenuItem[] = [
    {
      action: 'create-blueprint',
      label: 'Create Blueprint',
    },
    {
      action: 'add-subpackage',
      label: 'Create SubPackage',
    },
    {
      action: 'edit-subpackage',
      label: 'Edit SubPackage',
    },
  ]

  const onError = (error: any) => {
    console.log(error)
  }

  let formConfig = addPackageConfig({
    onSuccess: (node: any) => {
      addNode(node.title, NodeType.file)
      setShowModal(false)
    },
    onError,
    nodeId: node._id,
  })

  if (action === 'add-subpackage') {
    formConfig = addSubPackageConfig({
      onSuccess: (node: any) => {
        addNode(node.title, NodeType.folder)
        setShowModal(false)
      },
      onError,
      nodeId: node._id,
    })
  }

  if (action === 'edit-subpackage') {
    formConfig = editSubPackageConfig({
      onSuccess: (node: any) => {
        updateNode(node.title)
        setShowModal(false)
      },
      onError,
      nodeId: node._id,
    })
  }

  return (
    <>
      <Modal toggle={() => setShowModal(!showModal)} open={showModal}>
        <Form {...formConfig}></Form>
      </Modal>
      <WithContextMenu
        id={node._id}
        onClickContextMenu={(id: any, action: string) => {
          setAction(action)
          setShowModal(!showModal)
        }}
        menuItems={menuItems}
        label={node.title}
      />
    </>
  )
}

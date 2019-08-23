import React, { useState } from 'react'
import { NodeType } from '../../../../components/tree-view/TreeReducer'
import Modal from '../../../../components/modal/Modal'
import Form from '../../../../components/Form'
import axios from 'axios'
import ContextMenu from '../../../../components/context-menu/ContextMenu'

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
  const { onSuccess, onError } = props
  return {
    schemaUrl: '/api/templates/package.json',
    dataUrl: '',
    onSubmit: (formData: any) => {
      axios
        .put(
          `/api/blueprints/${formData.title}/${formData.version}/package.json`,
          formData
        )
        .then(res => {
          onSuccess(res.data)
        })
        .catch(err => {
          onError(err)
        })
    },
  }
}

function editPackageConfig(props: any) {
  const { onSuccess, onError, nodeId } = props
  let id = nodeId.substring(nodeId.indexOf('/') + 1)
  const dataUrl = `/api/blueprints/${id}`
  return {
    schemaUrl: '/api/templates/package.json',
    dataUrl,
    onSubmit: (formData: any) => {
      axios
        .put(dataUrl, formData)
        .then(res => {
          onSuccess(formData)
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

export const RootFolderNode = (props: any) => {
  const { node, addNode, updateNode } = props
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState('')

  const menuItems: NodeMenuItem[] = [
    {
      action: 'add-package',
      label: 'Create Package',
    },
    {
      action: 'edit-package',
      label: 'Edit Package',
    },
  ]

  const onSuccess = (node: any) => {
    addNode(node.title, NodeType.folder)
    setShowModal(false)
  }

  const onError = (error: any) => {
    console.log(error)
  }

  let formConfig = addPackageConfig({ onSuccess, onError })

  if (action == 'edit-package') {
    formConfig = editPackageConfig({
      onSuccess: (node: any) => {
        updateNode(node.title)
        setShowModal(false)
      },
      onError,
      nodeId: node.nodeId,
    })
  }

  return (
    <>
      <Modal toggle={() => setShowModal(!showModal)} open={showModal}>
        <Form {...formConfig}></Form>
      </Modal>
      <WithContextMenu
        id={node.nodeId}
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

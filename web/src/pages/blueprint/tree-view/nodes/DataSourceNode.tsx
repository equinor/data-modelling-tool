import React, { useState } from 'react'
import { NodeType } from '../../../../components/tree-view/TreeReducer'
import Modal from '../../../../components/modal/Modal'
import Form from '../../../../components/Form'
import axios from 'axios'
import ContextMenu from '../../../../components/context-menu/ContextMenu'
import { IndexNode } from '../../../../api/Api'

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
  const dataUrl = `/api/blueprints/${nodeId}`
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

export type Props = {
  node: IndexNode
  addNode: Function
  updateNode: Function
}

export const RootFolderNode = (props: Props) => {
  const { node, addNode, updateNode } = props
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState('')

  const configs: any[] = [
    {
      menuItem: {
        action: 'add-package',
        label: 'Create Package',
      },
      formProps: addPackageConfig({
        onSuccess: () => {
          addNode(node.title, NodeType.folder)
          setShowModal(false)
        },
        onError: (error: any) => {
          console.log(error)
        },
      }),
    },
    {
      menuItem: {
        action: 'edit-package',
        label: 'Edit Package',
      },
      formProps: editPackageConfig({
        onSuccess: (node: any) => {
          updateNode(node.title)
          setShowModal(false)
        },
        onError: (error: any) => {
          console.log(error)
        },
        nodeId: node._id,
      }),
    },
  ]

  const menuItems = configs.map(config => config.menuItem)
  const actionConfig = configs.find(config => config.menuItem.action === action)
  return (
    <>
      <Modal toggle={() => setShowModal(!showModal)} open={showModal}>
        {actionConfig && <Form {...actionConfig.formProps}></Form>}
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

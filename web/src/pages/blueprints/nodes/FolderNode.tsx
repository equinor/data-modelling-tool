import React, { useState } from 'react'
import ContextMenu from '../../../components/context-menu/ContextMenu'
import Modal from '../../../components/modal/Modal'
import { ActionConfig, Props } from './DataSourceNode'
import Form from '../../../components/Form'
import axios from 'axios'
import { NodeType } from '../../../components/tree-view/TreeReducer'
import { DmtApi } from '../../../api/Api'

const api = new DmtApi()

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

export type NodeMenuItem = {
  action: string
  label: string
}

export const FolderNode = (props: Props) => {
  const { node, datasource } = props
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState('')
  const configs: ActionConfig[] = [
    {
      menuItem: {
        action: 'create-blueprint',
        label: 'Create Blueprint',
      },
      formProps: {
        schemaUrl: api.templatesBlueprintGet(),
        dataUrl: null,
        onSubmit: (formData: any) => {
          const url = api.packagePost(datasource.id)
          axios
            .post(url, {
              nodeType: NodeType.file,
              isRoot: false,
              parentId: node.id,
              formData,
            })
            .then(res => {
              // addNode(node.title, NodeType.file)
              // setShowModal(false)
              //           onSuccess(res.data)
            })
            .catch(err => {
              // onError(err)
            })
        },
      },
    },
    {
      menuItem: {
        action: 'add-subpackage',
        label: 'Create SubPackage',
      },
      formProps: {
        schemaUrl: api.templatesPackageGet(),
        dataUrl: null,
        onSubmit: (formData: any) => {
          const url = api.packagePost(datasource.id)
          axios
            .post(url, {
              nodeType: 'folder',
              isRoot: false,
              parentId: node.id,
              formData,
            })
            .then(res => {
              // addNode(node.title, NodeType.file)
              // setShowModal(false)
              //           onSuccess(res.data)
            })
            .catch(err => {
              // onError(err)
            })
          // const url = `/api/blueprints/${id}/${formData.title}/package.json`
          //       axios
          //         .put(url, formData)
          //         .then(res => {
          // addNode(node.title, NodeType.folder)
          // setShowModal(false)
          //         })
          //         .catch(err => {
          //           onError(err)
          //         })
        },
      },
    },
    {
      menuItem: {
        action: 'edit-subpackage',
        label: 'Edit SubPackage',
      },
      formProps: {
        schemaUrl: '',
        dataUrl: '',
        onSubmit: () => {
          // axios
          //         .put(dataUrl, formData)
          //         .then(res => {
          // updateNode(node.title)
          // setShowModal(false)
          //         })
          //         .catch(err => {
          //           onError(err)
          //         })
        },
      },
    },
  ]

  const menuItems = configs.map(config => config.menuItem)
  const actionConfig: ActionConfig | undefined = configs.find(
    config => config.menuItem.action === action
  )
  return (
    <>
      <Modal toggle={() => setShowModal(!showModal)} open={showModal}>
        {actionConfig && <Form {...actionConfig.formProps}></Form>}
      </Modal>
      <WithContextMenu
        id={node.id}
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

import React, { useState } from 'react'
import axios from 'axios'
import Modal from '../../../components/modal/Modal'
import Form, { FormProps } from '../../../components/Form'
import ContextMenu from '../../../components/context-menu/ContextMenu'
import { Datasource, DmtApi, IndexNode } from '../../../api/Api'
import { DocumentsState } from '../../common/DocumentReducer'
import { NodeType } from '../../../components/tree-view/TreeReducer'

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

export type Props = {
  state: DocumentsState
  node: IndexNode
  addNode: Function
  updateNode: Function
  datasource: Datasource
}

export type ActionConfig = {
  menuItem: NodeMenuItem
  formProps: FormProps
}

export const RootFolderNode = (props: Props) => {
  const { node, updateNode, addNode, datasource } = props
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState('')

  const configs: ActionConfig[] = [
    {
      menuItem: {
        action: 'add-package',
        label: 'Create Package',
      },
      formProps: {
        schemaUrl: api.templatesPackageGet(),
        dataUrl: null,
        onSubmit: (formData: any) => {
          const url = api.packagePost(datasource.id)
          let parentId = node.id
          if (node.isRoot && node.nodeType === 'folder' && node.latestVersion) {
            parentId = node.latestVersion
          }
          axios
            .post(url, {
              parentId,
              nodeType: 'folder',
              isRoot: false,
              formData,
            })
            .then(res => {
              console.log(res)
              addNode(node.title, NodeType.folder)
              setShowModal(false)
            })
            .catch(err => {
              console.error(err)
            })
        },
      },
    },
    {
      menuItem: {
        action: 'edit-package',
        label: 'Edit Package',
      },
      formProps: {
        schemaUrl: api.templatesPackageGet(),
        dataUrl: api.documentGet(datasource.id, node.id),
        onSubmit: (formData: any) => {
          const url = api.documentPut(datasource.id, node.id)
          axios
            .put(url, formData)
            .then(() => {
              updateNode(node.id, formData.title)
              setShowModal(false)
            })
            .catch((e: any) => {
              console.log(e)
            })
        },
      },
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

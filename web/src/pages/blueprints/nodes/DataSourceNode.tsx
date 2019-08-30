import React, { useState } from 'react'
import axios from 'axios'
import Modal from '../../../components/modal/Modal'
import Form, { FormProps } from '../../../components/Form'
import ContextMenu from '../../../components/context-menu/ContextMenu'
import { DmtApi, IndexNode } from '../../../api/Api'
import { BlueprintState } from '../../common/BlueprintReducer'

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
  state: BlueprintState
  node: IndexNode
  addNode: Function
  updateNode: Function
}

export type ActionConfig = {
  menuItem: NodeMenuItem
  formProps: FormProps
}

export const RootFolderNode = (props: Props) => {
  const { node, state, updateNode } = props
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
          console.log(formData)
          // api.documentPut(state.selectedDocumentId, state.selectedEntityId, formData)
          //   .then(res => {
          //     addNode(node.title, NodeType.folder)
          //     setShowModal(false)
          //   })
          //   .catch(err => {
          //     console.error(err)
          //   })
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
        dataUrl: api.documentGet(state.selectedDataSourceId, node._id),
        onSubmit: (formData: any) => {
          const url = api.documentPut(state.selectedDataSourceId, node._id)
          axios
            .put(url, formData)
            .then(() => {
              updateNode(node._id, formData.title)
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

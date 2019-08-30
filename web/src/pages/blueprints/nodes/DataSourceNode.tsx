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
  const { node, state, updateNode, addNode, datasource } = props
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
          console.log(formData, node._id)
          axios
            .post(api.pacakagePost(datasource._id), {
              parentId: node._id,
              formData,
              nodeType: 'package',
            })
            // api.documentPut(state.selectedDocumentId, state.selectedEntityId, formData)
            .then((res: any) => {
              console.log(res)
              addNode(res._id, NodeType.folder)
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

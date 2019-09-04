import React, { useState } from 'react'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import axios from 'axios'
import Modal from '../../../components/modal/Modal'
import Form, { FormProps } from '../../../components/Form'
import ContextMenu from '../../../components/context-menu/ContextMenu'
import { DmtApi } from '../../../api/Api'
import { NodeComponentProps } from '../../common/tree-view/DocumentTree'
import { editPackage } from '../../common/context-menu-actions/EditPackage'
import { createBlueprint } from '../../common/context-menu-actions/CreateBluerpint'

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

export type ActionConfig = {
  menuItem: NodeMenuItem
  formProps: FormProps
}

export const RootFolderNode = (props: NodeComponentProps) => {
  const { node, updateNode, addNode, datasource } = props
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState('')

  const configs: ActionConfig[] = [
    /**
     *  Bug in api.
     */
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
          axios
            .post(url, {
              parentId: node.nodeId,
              nodeType: 'folder',
              isRoot: false,
              formData,
            })
            .then(res => {
              console.log(res)
              // const treeNode = new TreeNodeBuilder(res.data)
              //   .setOpen(true)
              //   .buildFolderNode()
              //
              // addNode(treeNode, node.nodeId)
              // setShowModal(false)
              // NotificationManager.success(res.data.id, 'Package created')
            })
            .catch(err => {
              console.log(err)
              NotificationManager.error(
                err.statusText,
                'failed to create package.'
              )
            })
        },
      },
    },
    editPackage({ node, addNode, updateNode, datasource, setShowModal }),
    createBlueprint({ datasource, node, updateNode, addNode, setShowModal }),
  ]

  const menuItems = configs.map(config => config.menuItem)
  const actionConfig = configs.find(config => config.menuItem.action === action)
  return (
    <>
      <Modal toggle={() => setShowModal(!showModal)} open={showModal}>
        {actionConfig && <Form {...actionConfig.formProps}></Form>}
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

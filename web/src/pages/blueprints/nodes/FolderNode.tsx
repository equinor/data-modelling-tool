import React, { useState } from 'react'
import ContextMenu from '../../../components/context-menu/ContextMenu'
import Modal from '../../../components/modal/Modal'
import { ActionConfig } from './DataSourceNode'
import Form from '../../../components/Form'
import axios from 'axios'
import { DmtApi } from '../../../api/Api'
import { NodeComponentProps } from '../../common/tree-view/DocumentTree'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { createBlueprint } from '../../common/context-menu-actions/CreateBluerpint'
import { editPackage } from '../../common/context-menu-actions/EditPackage'
import { TreeNodeBuilder } from '../../common/tree-view/TreeNodeBuilder'

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

export const FolderNode = (props: NodeComponentProps) => {
  const { node, datasource, updateNode, addNode } = props
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState('')
  const configs: ActionConfig[] = [
    createBlueprint({ datasource, node, updateNode, addNode, setShowModal }),
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
              parentId: node.nodeId,
              nodeType: 'folder',
              isRoot: false,
              formData,
            })
            .then(res => {
              const treeNode: TreeNodeData = new TreeNodeBuilder(
                res.data
              ).buildFolderNode()
              addNode(treeNode, node.nodeId)
              setShowModal(false)
            })
            .catch(err => {
              console.log(err)
            })
        },
      },
    },
    editPackage({ node, updateNode, addNode, datasource, setShowModal }),
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
      {
        <WithContextMenu
          id={node.nodeId}
          onClickContextMenu={(id: any, action: string) => {
            setAction(action)
            setShowModal(!showModal)
          }}
          menuItems={menuItems}
          label={node.title}
        />
      }
    </>
  )
}

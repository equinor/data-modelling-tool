import React, { useState } from 'react'
import { ActionConfig } from './Types'
import Modal from '../../../components/modal/Modal'
import Form from '../../../components/Form'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import ContextMenu from '../../../components/context-menu/ContextMenu'

type WithContextMenuProps = {
  node: TreeNodeData
  configs: ActionConfig[]
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

const WithContextMenu = (props: WithContextMenuProps) => {
  const { node, configs, showModal, setShowModal } = props
  const [action, setAction] = useState('')

  const menuItems = configs.map(config => config.menuItem)
  const actionConfig = configs.find(config => config.menuItem.action === action)
  return (
    <>
      <Modal toggle={() => setShowModal(!showModal)} open={showModal}>
        {actionConfig && <Form {...actionConfig.formProps}></Form>}
      </Modal>
      <ContextMenu
        id={node.nodeId}
        onClickContextMenu={(id: any, action: string) => {
          setAction(action)
          setShowModal(!showModal)
        }}
        menuItems={menuItems}
        label={node.title}
      >
        {node.title}
      </ContextMenu>
    </>
  )
}

export default WithContextMenu

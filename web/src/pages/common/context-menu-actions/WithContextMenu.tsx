import React, { useState } from 'react'
import { ActionConfig } from './Types'
import Modal from '../../../components/modal/Modal'
import Form from '../../../components/Form'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import ContextMenu, {
  MenuItem,
} from '../../../components/context-menu/ContextMenu'

type WithContextMenuProps = {
  node: TreeNodeData
  menuItems: MenuItem[]
  configs: ActionConfig[]
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

const WithContextMenu = (props: WithContextMenuProps) => {
  const { node, configs, showModal, setShowModal, menuItems } = props
  const [action, setAction] = useState('')

  const actionConfig = configs.find(config => config.action === action)

  return (
    <>
      <Modal
        toggle={() => setShowModal(!showModal)}
        open={showModal}
        title={actionConfig && actionConfig.action}
      >
        {actionConfig && <Form {...actionConfig.formProps}></Form>}
      </Modal>
      <ContextMenu
        id={node.nodeId}
        onClickContextMenu={(id: any, action: string) => {
          setAction(action)
          setShowModal(!showModal)
        }}
        menuItems={menuItems}
      >
        {node.title}
      </ContextMenu>
    </>
  )
}

export default WithContextMenu

import React, { useState } from 'react'
import { ActionConfig } from './Types'
import Modal from '../../../components/modal/Modal'
import Form from '../../../components/Form'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import ContextMenu, {
  MenuItem,
} from '../../../components/context-menu/ContextMenu'
import { ContextMenuActionsFactory } from './ContextMenuActionsFactory'
import { AddNode } from '../tree-view/DocumentTree'

type WithContextMenuProps = {
  node: TreeNodeData
  menuItems: MenuItem[]
  configs?: ActionConfig[]
  addNode?: AddNode
}

const WithContextMenu = (props: WithContextMenuProps) => {
  const { node, menuItems } = props
  const [action, setAction] = useState('')
  const [showModal, setShowModal] = useState(false)

  const actionFactory = new ContextMenuActionsFactory()
  const actionConfig = actionFactory.getActionConfig(action, {
    ...props,
    setShowModal,
  })

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

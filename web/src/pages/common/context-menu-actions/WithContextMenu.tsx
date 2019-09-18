import React, { useState } from 'react'
import { ActionConfig } from './Types'
import Modal from '../../../components/modal/Modal'
import Form from '../../../components/Form'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import ContextMenu, {
  MenuItem,
} from '../../../components/context-menu/ContextMenu'
import { ContextMenuActionsFactory } from './ContextMenuActionsFactory'
import { AddNode, UpdateNode } from '../tree-view/DocumentTree'

type WithContextMenuProps = {
  treeNodeData: TreeNodeData
  menuItems: MenuItem[]
  configs?: ActionConfig[]
  addNode: AddNode
  updateNode: UpdateNode
}

const WithContextMenu = (props: WithContextMenuProps) => {
  const { treeNodeData, menuItems } = props
  const [action, setAction] = useState('')
  const [showModal, setShowModal] = useState(false)

  const actionFactory = new ContextMenuActionsFactory()
  const actionConfig = actionFactory.getActionConfig(action, {
    treeNodeData,
    addNode: props.addNode,
    updateNode: props.updateNode,
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
        id={treeNodeData.nodeId}
        onClickContextMenu={(id: any, action: string) => {
          setAction(action)
          setShowModal(!showModal)
        }}
        menuItems={menuItems}
      >
        {treeNodeData.title}
      </ContextMenu>
    </>
  )
}

export default WithContextMenu

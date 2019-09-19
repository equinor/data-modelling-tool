import React, { useState } from 'react'
import { ActionConfig } from './Types'
import Modal from '../../../components/modal/Modal'
import Form from '../../../components/Form'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import ContextMenu, {
  MenuItem,
} from '../../../components/context-menu/ContextMenu'
import { ContextMenuActionsFactory } from './ContextMenuActionsFactory'
import { RenderProps } from '../tree-view/DocumentTree'

interface WithContextMenuProps extends RenderProps {
  menuItems: MenuItem[]
  configs?: ActionConfig[]
}

const WithContextMenu = (props: WithContextMenuProps) => {
  return (
    <WithContextMenuModal
      {...props}
      render={({ actionConfig }: any) => (
        <>{actionConfig && <Form {...actionConfig.formProps} />}</>
      )}
    />
  )
}
export default WithContextMenu

interface WithContextMenuModalProps extends RenderProps {
  menuItems: MenuItem[]
  treeNodeData: TreeNodeData
  render: (props: any) => any
}

export const WithContextMenuModal = (props: WithContextMenuModalProps) => {
  const { treeNodeData, menuItems, render } = props
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
        open={showModal}
        title={action}
        toggle={() => setShowModal(!showModal)}
      >
        {render({ action, actionConfig })}
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

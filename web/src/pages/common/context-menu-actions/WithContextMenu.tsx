import React, { useState } from 'react'
import Modal from '../../../components/modal/Modal'
import Form, { FormProps } from '../../../components/Form'
import ContextMenu, {
  MenuItem,
} from '../../../components/context-menu/ContextMenu'
import { ContextMenuActionsFactory } from './ContextMenuActionsFactory'
import { TreeNodeRenderProps } from '../../../components/tree-view/TreeNode'

export type ActionConfig = {
  action: string
  formProps: FormProps
  fetchDocumentData?: any
}

interface WithContextMenuProps {
  children: any
  layout: any
  node: TreeNodeRenderProps
}

export type SetShowModal = (showModal: boolean) => void

const WithContextMenu = (props: WithContextMenuProps) => {
  const { layout, node, children } = props
  return (
    <WithContextMenuModal
      layout={layout}
      node={node}
      children={children}
      render={({ actionConfig }: any) => {
        const { formProps } = actionConfig
        return (
          <>
            {actionConfig && formProps.fetchDocument && <Form {...formProps} />}
            {actionConfig && formProps.prompt && (
              <div>
                <h4>{formProps.prompt.title}</h4>
                {formProps.prompt.content}
                <button onClick={formProps.onSubmit}>Submit</button>
              </div>
            )}
          </>
        )
      }}
    />
  )
}
export default WithContextMenu

interface WithContextMenuModalProps {
  render: (props: any) => any
  layout: any
  node: TreeNodeRenderProps
  children: any
}

interface ActionData {
  templateRef?: string
  label: string
}

interface Action {
  data: ActionData
  type: string
}

export const WithContextMenuModal = (props: WithContextMenuModalProps) => {
  const { node, render, layout, children } = props
  const [action, setAction] = useState<Action>({
    data: { label: '' },
    type: '',
  })
  const [showModal, setShowModal] = useState(false)

  const actionFactory = new ContextMenuActionsFactory()
  const actionConfig = actionFactory.getActionConfig(action, {
    node,
    setShowModal,
    layout,
  })

  const { nodeData } = node
  const { meta } = nodeData
  const { menuItems = [] } = meta as any

  return (
    <>
      <Modal
        open={showModal}
        title={action.data ? action.data.label : action.type}
        toggle={() => setShowModal(!showModal)}
      >
        {render({ action, actionConfig, setShowModal })}
      </Modal>
      <ContextMenu
        id={node.nodeData.nodeId}
        onClickContextMenu={(id: any, action: string, data: { label: '' }) => {
          setAction({ type: action, data })
          setShowModal(!showModal)
        }}
        menuItems={menuItems}
      >
        {children || node.nodeData.title}
      </ContextMenu>
    </>
  )
}

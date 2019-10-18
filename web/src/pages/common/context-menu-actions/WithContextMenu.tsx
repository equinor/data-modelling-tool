import React, { useState } from 'react'
import Modal from '../../../components/modal/Modal'
import Form, { FormProps } from '../../../components/Form'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import ContextMenu, {
  MenuItem,
} from '../../../components/context-menu/ContextMenu'
import { ContextMenuActionsFactory } from './ContextMenuActionsFactory'
import { RenderProps } from '../tree-view/DocumentTree'

export type ActionConfig = {
  action: string
  formProps: FormProps
  fetchDocumentData?: any
}

interface WithContextMenuProps extends RenderProps {
  menuItems: MenuItem[]
  configs?: ActionConfig[]
  children?: any
  layout?: any
}

export type SetShowModal = (showModal: boolean) => void

const WithContextMenu = (props: WithContextMenuProps) => {
  return (
    <WithContextMenuModal
      {...props}
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

interface WithContextMenuModalProps extends RenderProps {
  menuItems: MenuItem[]
  treeNodeData: TreeNodeData
  render: (props: any) => any
  children?: any
  layout?: any
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
  const { treeNodeData, menuItems, render, children, layout } = props
  const [action, setAction] = useState<Action>({
    data: { label: '' },
    type: '',
  })
  const [showModal, setShowModal] = useState(false)

  const actionFactory = new ContextMenuActionsFactory()
  const actionConfig = actionFactory.getActionConfig(action, {
    treeNodeData,
    addNode: props.addNode,
    updateNode: props.updateNode,
    removeNode: props.removeNode,
    replaceNode: props.replaceNode,
    path: props.path,
    parent: props.parent,
    setShowModal,
    layout,
  })

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
        id={treeNodeData.nodeId}
        onClickContextMenu={(id: any, action: string, data: { label: '' }) => {
          setAction({ type: action, data })
          setShowModal(!showModal)
        }}
        menuItems={menuItems}
      >
        {children || treeNodeData.title}
      </ContextMenu>
    </>
  )
}

import React, { useEffect, useState } from 'react'
import Modal from '../../../components/modal/Modal'
import Form from '../../../components/Form'
import ContextMenu from '../../../components/context-menu/ContextMenu'
import {
  ContextMenuActions,
  ContextMenuActionsFactory,
} from './ContextMenuActionsFactory'
import { TreeNodeRenderProps } from '../../../components/tree-view/TreeNode'
import Api2 from '../../../api/Api2'
import { RegisteredPlugins } from '../layout-components/DocumentComponent'
import { ActionEditPlugin } from './ActionEditPlugin'

interface WithContextMenuProps {
  children: any
  layout: any
  node: TreeNodeRenderProps
}

export type SetShowModal = (showModal: boolean) => void

const Prompt = (props: any) => {
  const { title, content, onSubmit, buttonText } = props
  return (
    <div>
      <h4>{title}</h4>
      {content}
      <div>
        <button onClick={() => onSubmit()}>{buttonText}</button>
      </div>
    </div>
  )
}

const WithContextMenu = (props: WithContextMenuProps) => {
  const { layout, node, children } = props
  return (
    <WithContextMenuModal
      layout={layout}
      node={node}
      children={children}
      render={({ actionConfig, setShowModal }: any) => {
        const { formProps } = actionConfig
        if (formProps.plugin === RegisteredPlugins.EDIT_PLUGIN) {
          return (
            <ActionEditPlugin
              {...actionConfig}
              {...node}
              setShowModal={setShowModal}
            />
          )
        }
        return (
          <>
            {actionConfig && formProps.fetchDocument && <Form {...formProps} />}
            {actionConfig && formProps.prompt && (
              <Prompt
                title={formProps.prompt.title}
                content={formProps.prompt.content}
                onSubmit={formProps.onSubmit}
                buttonText={formProps.prompt.buttonText}
              />
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
  dataUrl?: string
}

interface ActionData {
  templateRef?: string
  label: string
}

interface Action {
  data: ActionData
  type: string
}

const WithContextMenuModal = (props: WithContextMenuModalProps) => {
  const { node, render, layout, children, dataUrl } = props
  const [action, setAction] = useState<Action>({
    data: { label: '' },
    type: '',
  })
  const [entity, setEntity] = useState({ type: '', description: '', name: '' })
  const [showModal, setShowModal] = useState(false)
  const actionFactory = new ContextMenuActionsFactory()
  const actionConfig = actionFactory.getActionConfig(action, {
    node,
    setShowModal,
    layout,
    entity,
  })
  const { nodeData } = node
  const { meta } = nodeData
  const { menuItems = [] } = meta as any

  useEffect(() => {
    if (action.type === ContextMenuActions.RUNNABLE) {
      Api2.get({
        // @ts-ignore
        url: node.nodeData.meta.fetchUrl.data.dataUrl,
        onSuccess: result => {
          setEntity(result.document)
        },
        onError: error => {
          console.error('failed to fetch document: ' + error.statusText)
        },
      })
    }
  }, [dataUrl, action])

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
        {children}
      </ContextMenu>
    </>
  )
}

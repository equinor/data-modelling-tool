//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import Api2 from '../../../api/Api2'
import { createAction } from './actions/create'
import { updateAction } from './actions/update'
import { AddChild } from '../tree-view/DocumentTree'

export enum ContextMenuActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export type ContextMenuActionProps = {
  treeNodeData: TreeNodeData
  addNode: Function
  addNodes: Function
  setShowModal: Function
  removeNode: Function
  updateNode: Function
  replaceNode: Function
  addChild: Function
  layout?: any
  path: string
  parent: string
}

const getFormProperties = (action: any, props: ContextMenuActionProps) => {
  const {
    treeNodeData,
    addNode,
    addNodes,
    setShowModal,
    addChild,
    removeNode,
    layout,
    replaceNode,
    path,
    parent,
  } = props

  const showError = (error: any) => {
    console.error(error)
    NotificationManager.error(error.response.data.message, 'Failed')
  }

  const [method, actionType] = action.type.split('/')

  switch (method) {
    case ContextMenuActions.CREATE: {
      return createAction(
        action,
        addNode,
        addNodes,
        addChild,
        setShowModal,
        treeNodeData.nodeId
      )
    }

    case ContextMenuActions.UPDATE: {
      return updateAction(action, addNode, setShowModal, treeNodeData.nodeId)
    }

    case ContextMenuActions.DELETE: {
      return {
        prompt: action.data.prompt,
        onSubmit: () => {
          Api2.post({
            url: action.data.url,
            data: action.data.request,
            onSuccess: () => {
              //removeNode(treeNodeData.nodeId, props.parent)
              //layout.remove(treeNodeData.nodeId)
            },
            onError: (error: any) => showError(error),
          })
        },
      }
    }

    default:
      return {
        schemaUrl: '',
        dataUrl: '',
        onSubmit: () => {},
      }
  }
}

export class ContextMenuActionsFactory {
  getActionConfig(action: any, props: ContextMenuActionProps) {
    return {
      formProps: getFormProperties(action, props),
      action: action.type,
    }
  }
}

//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { createAction } from './actions/create'
import { updateAction } from './actions/update'
import { TreeNodeRenderProps } from '../../../components/tree-view/TreeNode'
import { SetShowModal } from './WithContextMenu'
import { deleteAction } from './actions/delete'

export enum ContextMenuActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface ContextMenuActionProps {
  node: TreeNodeRenderProps
  layout?: any
  setShowModal: SetShowModal
}

const getFormProperties = (action: any, props: ContextMenuActionProps) => {
  const { node, setShowModal, layout } = props

  const showError = (error: any) => {
    console.error(error)
    NotificationManager.error(error.response.data.message, 'Failed')
  }

  const [method, actionType] = action.type.split('/')

  switch (method) {
    case ContextMenuActions.CREATE: {
      return createAction(action, node, setShowModal, showError)
    }
    case ContextMenuActions.UPDATE: {
      return updateAction(action, node, setShowModal, showError)
    }
    case ContextMenuActions.DELETE: {
      return deleteAction(action, node, setShowModal, showError, layout)
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

//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { createAction } from './actions/create'
import { updateAction } from './actions/update'
import { TreeNodeRenderProps } from '../../../components/tree-view/TreeNode'
import { SetShowModal } from './WithContextMenu'
import { deleteAction } from './actions/delete'
import { downloadAction } from './actions/download'
import { Action } from './actions/actions'
import Api2 from '../../../api/Api2'
import values from 'lodash/values'
import { IndexNode } from '../../../api/Api'
import { createTreeNode } from '../tree-view/TreeNodeBuilderOld'
import { toObject } from './actions/utils/to_object'
import { importAction } from './actions/import'
import { Entity } from '../../../domain/types'
import { insertReferenceAction } from './actions/insertReference'

export enum ContextMenuActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  DOWNLOAD = 'DOWNLOAD',
  RUNNABLE = 'RUNNABLE',
  IMPORT = 'IMPORT',
  INSERT_REFERENCE = 'INSERT_REFERENCE',
}

export interface ContextMenuActionProps {
  node: TreeNodeRenderProps
  layout?: any
  setShowModal: SetShowModal
  entity: Entity
}

interface CreateNodesProps {
  documentId: string
  nodeUrl: string
  node: TreeNodeRenderProps
  loadingCallBack?: Function
}

export const CreateNodes = (props: CreateNodesProps) => {
  const { documentId, nodeUrl, node, loadingCallBack } = props

  Api2.get({
    url: `${nodeUrl}/${documentId}?APPLICATION=${node.nodeData.meta.application}`,
    onSuccess: result => {
      if (loadingCallBack) loadingCallBack(false)
      const nodes: any = values(result)
      const indexNodes = nodes.map((node: IndexNode) => {
        return createTreeNode({
          id: node.id,
          filename: node.title,
          nodeType: node.nodeType,
          children: node.children,
          templateRef: node.templateRef,
          meta: node.meta,
          type: node.type,
          isOpen: documentId === node.id,
        })
      })
      const parentId = nodes[0]['parentId']
      const nodeId = nodes[0]['id']
      node.actions.removeNode(nodeId)
      node.actions.addNodes(indexNodes.reduce(toObject, {}))
      if (!node.actions.hasChild(parentId, nodeId)) {
        node.actions.addChild(parentId, nodeId)
      }
    },
    onError: (err: any) => console.error(Object.keys(err)),
  })
}

const getFormProperties = (
  action: any,
  props: ContextMenuActionProps
): Object => {
  const { node, setShowModal, layout, entity } = props

  const showError = (error: any) => {
    console.error(error)
    NotificationManager.error(error.response.data.message, 'Failed')
  }

  const [method] = action.type.split('/')

  switch (method) {
    case ContextMenuActions.CREATE: {
      return createAction(action, node, setShowModal, showError, CreateNodes)
    }
    case ContextMenuActions.UPDATE: {
      return updateAction(action, node, setShowModal, showError, CreateNodes)
    }
    case ContextMenuActions.DELETE: {
      return deleteAction(action, node, setShowModal, showError, layout)
    }
    case ContextMenuActions.DOWNLOAD: {
      return downloadAction(action)
    }
    case ContextMenuActions.RUNNABLE: {
      return Action(action, node, setShowModal, CreateNodes, layout, entity)
    }
    case ContextMenuActions.IMPORT: {
      return importAction(action)
    }
    case ContextMenuActions.INSERT_REFERENCE: {
      return insertReferenceAction(action, node, setShowModal, CreateNodes)
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

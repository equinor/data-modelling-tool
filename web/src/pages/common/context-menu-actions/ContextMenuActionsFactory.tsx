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
import { TreeNodeBuilderOld } from '../tree-view/TreeNodeBuilderOld'
import { toObject } from './actions/utils/to_object'
import { importAction } from './actions/import'
import { Entity } from '../../../domain/types'

export enum ContextMenuActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  DOWNLOAD = 'DOWNLOAD',
  RUNNABLE = 'RUNNABLE',
  IMPORT = 'IMPORT',
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
}

const createNodes = (props: CreateNodesProps) => {
  const { documentId, nodeUrl, node } = props
  Api2.get({
    url: `${nodeUrl}/${documentId}`,
    onSuccess: result => {
      const nodes: any = values(result)
      const indexNodes = nodes.map((node: IndexNode) =>
        new TreeNodeBuilderOld(node).build()
      )
      // TODO: Is it possible to move parent id to API? Seems hard.
      const parentId = nodes[0]['parentId'] || node.nodeData.nodeId
      node.actions.removeNode(nodes[0]['id'], parentId)
      node.actions.addNodes(indexNodes.reduce(toObject, {}))
      // Connect new nodes to parent in tree
      node.actions.addChild(parentId, nodes[0]['id'])
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
      return createAction(action, node, setShowModal, showError, createNodes)
    }
    case ContextMenuActions.UPDATE: {
      return updateAction(action, node, setShowModal, showError, createNodes)
    }
    case ContextMenuActions.DELETE: {
      return deleteAction(action, node, setShowModal, showError, layout)
    }
    case ContextMenuActions.DOWNLOAD: {
      return downloadAction(action)
    }
    case ContextMenuActions.RUNNABLE: {
      return Action(action, node, setShowModal, createNodes, layout, entity)
    }
    case ContextMenuActions.IMPORT: {
      return importAction(action, setShowModal)
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

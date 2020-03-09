import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'

import Actions from '../../../../actions'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import Api2 from '../../../../api/Api2'
import saveToNewFile from './saveToNewFile'
import saveInEntity from './saveInEntity'
import { Entity } from '../../../../domain/types'

enum ActionTypes {
  separateResultFile = 'separateResultFile',
  resultInEntity = 'resultInEntity',
}

export type Input = {
  blueprint: string
  entity: Entity
  path: string
  id: string
}

export type Output = {
  blueprint: string
  entity: any
  dataSource: string
  id: string
  notify?: Boolean
}

export type ActionProps = {
  input: Input
  output?: Output
  updateDocument?: Function
}

export type Method = (props: ActionProps) => any

function updateDocument(
  node: any,
  output: Output,
  layout: any,
  parentId: any,
  createNodes: Function
) {
  Api2.put({
    url: `/api/v2/documents/${output.dataSource}/${output.id}`,
    data: output.entity,
    onSuccess: (response: any) => {
      layout.refreshByFilter(output.id)
      output.notify &&
        NotificationManager.success(
          `updated document: ${response.data.data.name}`
        )
      refresh(node, output, parentId, createNodes)
    },
    onError: (error: any) => {
      NotificationManager.error(`failed to update document: ${output.id}`)
    },
  })
}

function refresh(
  node: TreeNodeRenderProps,
  output: any,
  parentId: string,
  createNodes: Function
) {
  // Create the result node in index tree
  createNodes({
    documentId: `${output.id}`,
    nodeUrl: `/api/v4/index/${output.dataSource}/${parentId}`,
    node,
  })
}

export const Action = (
  action: any,
  node: TreeNodeRenderProps,
  setShowModal: Function,
  createNodes: Function,
  layout: any,
  entity: Entity
) => {
  const methodToRun: string = action.data.runnable.method
  // @ts-ignore
  if (!Actions[methodToRun]) {
    NotificationManager.error(`Runnable Method "${methodToRun}"`, 'Not Found')
    return {}
  }
  // @ts-ignore
  const method: Method = Actions[methodToRun]
  const dataSource = node.path.substr(0, node.path.indexOf('/'))

  async function handleUpdate(output: Output, parentId: string) {
    await updateDocument(node, output, layout, parentId, createNodes)
  }

  const input: Input = {
    blueprint: entity.type,
    entity: entity,
    path: node.path,
    id: node.nodeData.nodeId,
  }
  if (action.data.runnable.actionType === ActionTypes.resultInEntity) {
    return saveInEntity(input, method, setShowModal, handleUpdate, dataSource)
  } else {
    return saveToNewFile(
      action.data.runnable.output,
      input,
      method,
      node,
      setShowModal,
      createNodes,
      handleUpdate,
      dataSource
    )
  }
}

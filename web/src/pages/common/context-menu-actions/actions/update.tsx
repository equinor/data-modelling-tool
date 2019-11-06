import Api2, { BASE_CRUD } from '../../../../api/Api2'
import { processFormData } from './utils/request'
import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'
// @ts-ignore
import objectPath from 'object-path'

const fetchUpdate = (action: any) => {
  return ({ onSuccess, onError = () => {} }: BASE_CRUD): void => {
    if (objectPath.has(action.data, 'formData')) {
      Api2.get({
        url: action.data.schemaUrl,
        onSuccess: result =>
          onSuccess({
            template: result,
            document: objectPath.get(action.data, 'formData'),
          }),
        onError,
      })
    } else {
      Api2.fetchWithTemplate({
        urlSchema: action.data.schemaUrl,
        urlData: action.data.dataUrl,
        onSuccess,
        onError,
      })
    }
  }
}

interface PostUpdateProps {
  response: any
  action: any
  setShowModal: Function
  node: TreeNodeRenderProps
  createNodes: Function
}

export const postUpdate = ({
  setShowModal,
  action,
  response,
  node,
  createNodes,
}: PostUpdateProps) => {
  setShowModal(false)
  //const data = node.nodeData
  //data.title = response.data.data['name']
  //node.actions.updateNode(data)
  node.actions.removeNode(node.nodeData.nodeId, node.parent)
  createNodes({
    documentId: response.data.uid,
    nodeUrl: action.data.nodeUrl,
    node,
  })
}

export const updateAction = (
  action: any,
  node: TreeNodeRenderProps,
  setShowModal: Function,
  showError: Function,
  createNodes: Function
) => {
  return {
    fetchDocument: fetchUpdate(action),
    onSubmit: (formData: any) => {
      const data = processFormData(action.data.request, formData)
      Api2.put({
        data: data,
        url: action.data.url,
        onSuccess: (response: any) => {
          postUpdate({ setShowModal, action, response, node, createNodes })
        },
        onError: (error: any) => showError(error),
      })
    },
  }
}

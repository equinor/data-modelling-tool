import Api2, { BASE_CRUD } from '../../../../api/Api2'
import { processFormData } from './utils/request'
import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'

const fetchUpdate = (action: any) => {
  return ({ onSuccess, onError = () => {} }: BASE_CRUD): void =>
    Api2.fetchWithTemplate({
      urlSchema: action.data.schemaUrl,
      urlData: action.data.dataUrl,
      onSuccess,
      onError,
    })
}
interface PostUpdateProps {
  response: any
  setShowModal: Function
  node: TreeNodeRenderProps
}

export const postUpdate = ({
  setShowModal,
  response,
  node,
}: PostUpdateProps) => {
  setShowModal(false)
  const data = node.nodeData
  data.title = response.data.data['name']
  node.actions.updateNode(data)
}

export const updateAction = (
  action: any,
  node: TreeNodeRenderProps,
  setShowModal: Function,
  showError: Function
) => {
  return {
    fetchDocument: fetchUpdate(action),
    onSubmit: (formData: any) => {
      // TODO: Does not support moves between folders and datasources now
      const newPath = { newPath: `${node.path}/${formData.name}` }
      const data = processFormData(action.data.request, newPath)
      Api2.put({
        data: data,
        url: action.data.url,
        onSuccess: (response: any) => {
          postUpdate({ setShowModal, response, node })
        },
        onError: (error: any) => showError(error),
      })
    },
  }
}

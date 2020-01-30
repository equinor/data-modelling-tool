import Api2, { BASE_CRUD } from '../../../../api/Api2'
import { processFormData } from './utils/request'
import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'

export const createAction = (
  action: any,
  node: TreeNodeRenderProps,
  setShowModal: Function,
  showError: Function,
  createNodes: Function
) => {
  const createhandleSubmitConfig = () => {
    return (formData: any) => {
      const data = processFormData(action.data.request, formData)
      Api2.post({
        data: data,
        url: action.data.url,
        onSuccess: (result: any) => {
          createNodes({
            documentId: result.data.uid,
            nodeUrl: action.data.nodeUrl,
            node,
          })
          setShowModal(false)
        },
        onError: (error: any) => showError(error),
      })
    }
  }

  return {
    selectedUiSchema: 'DEFAULT_CREATE',
    fetchDocument: ({ onSuccess, onError = () => {} }: BASE_CRUD): void => {
      Api2.get({
        url: action.data.schemaUrl,
        onSuccess: result => onSuccess({ template: result, document: {} }),
        onError,
      })
    },
    onSubmit: createhandleSubmitConfig(),
  }
}

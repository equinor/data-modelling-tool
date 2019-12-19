import Api2 from '../../../../api/Api2'
import { TreeNodeRenderProps } from '../../../../components/tree-view/TreeNode'

export const deleteAction = (
  action: any,
  node: TreeNodeRenderProps,
  setShowModal: Function,
  showError: Function,
  layout: any
) => {
  return {
    prompt: {
      title: 'Are you sure?',
      content: 'Would you like to remove this item?',
      buttonText: 'Delete',
    },
    onSubmit: () => {
      Api2.post({
        url: action.data.url,
        data: action.data.request,
        onSuccess: () => {
          node.actions.removeNode(node.nodeData.nodeId, node.parent)
          layout.remove(node.nodeData.nodeId)
        },
        onError: (error: any) => showError(error),
      })
    },
  }
}

import { TreeNodeData } from '../../../components/tree-view/Tree'
import { TreeNodeBuilder } from '../tree-view/TreeNodeBuilder'
import Api2 from '../../../api/Api2'

export function createBlueprint(props: {
  node: TreeNodeData
  addNode: Function
  setShowModal: Function
}): any {
  const { node, addNode, setShowModal } = props
  return {
    fetchDocument: Api2.fetchCreateBlueprint,
    onSubmit: (formData: any) => {
      Api2.postCreateDocument({
        parentId: node.nodeId,
        formData,
        onSuccess: (res: any) => {
          const treeNodeData: TreeNodeData = new TreeNodeBuilder(
            res.data
          ).buildFileNode()
          addNode(treeNodeData, node.nodeId)
          setShowModal(false)
        },
        onError: (err: any) => console.error(Object.keys(err)),
      })
    },
  }
}

import axios from 'axios'
import { NodeType } from '../../../components/tree-view/TreeReducer'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { TreeNodeBuilder } from '../tree-view/TreeNodeBuilder'
import { DmtApi } from '../../../api/Api'

const api = new DmtApi()

export function createBlueprint(props: {
  node: TreeNodeData
  addNode: Function
  setShowModal: Function
}): any {
  const { node, addNode, setShowModal } = props
  return {
    schemaUrl: api.templatesCreateBlueprintGet(),
    dataUrl: null,
    onSubmit: (formData: any) => {
      const dataSourceId = node.nodeId.split('/')[0]
      const url = api.packagePost(dataSourceId)
      axios
        .post(url, {
          nodeType: NodeType.file,
          isRoot: false,
          parentId: node.nodeId,
          formData,
        })
        .then(res => {
          const treeNodeData: TreeNodeData = new TreeNodeBuilder(
            res.data
          ).buildFileNode()
          addNode(treeNodeData, node.nodeId)
          setShowModal(false)
        })
        .catch(err => {
          console.log(Object.keys(err))
          // onError(err)
        })
    },
  }
}

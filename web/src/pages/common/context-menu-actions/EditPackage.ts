import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { DmtApi } from '../../../api/Api'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import Api2 from '../../../api/Api2'
const api = new DmtApi()

export function editPackage(props: {
  node: TreeNodeData
  updateNode: Function
  setShowModal: Function
}): any {
  const { node, updateNode, setShowModal } = props
  return {
    fetchDocument: Api2.fetchDocument(node.nodeId),
    onSubmit: (formData: any) => {
      const url = api.documentPut(node.nodeId)
      axios
        .put(url, formData)
        .then(() => {
          updateNode({ ...node, title: formData.title })
          setShowModal(false)
          NotificationManager.success(formData.title, 'Updated package title')
        })
        .catch((e: any) => {
          console.log(e)
        })
    },
  }
}

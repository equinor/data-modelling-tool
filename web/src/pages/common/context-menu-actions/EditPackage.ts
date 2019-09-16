import axios from 'axios'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { DmtApi } from '../../../api/Api'
import { TreeNodeData } from '../../../components/tree-view/Tree'
const api = new DmtApi()

export function editPackage(props: {
  node: TreeNodeData
  updateNode: Function
  setShowModal: Function
}): any {
  const { node, updateNode, setShowModal } = props
  return {
    schemaUrl: api.templatesPackageGet(),
    dataUrl: api.documentGet(node.nodeId),
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

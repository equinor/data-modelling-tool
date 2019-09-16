import { TreeNodeData } from '../../../components/tree-view/Tree'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import axios from 'axios'
import { DmtApi } from '../../../api/Api'

const api = new DmtApi()

export const createPackage = (props: { node: TreeNodeData }): any => {
  const { node } = props
  return {
    schemaUrl: api.templatesPackageGet(),
    dataUrl: null,
    onSubmit: (formData: any) => {
      const url = api.packagePost(node.nodeId)
      if (node.isRoot) {
      }
      axios
        .post(url, {
          parentId: node.nodeId,
          nodeType: 'folder',
          isRoot: false,
          formData,
        })
        .then(res => {
          console.log(res)
          // const treeNode = new TreeNodeBuilder(res.data)
          //   .setOpen(true)
          //   .buildFolderNode()
          //
          // addNode(treeNode, node.nodeId)
          // setShowModal(false)
          // NotificationManager.success(res.data.id, 'Package created')
        })
        .catch(err => {
          console.log(err)
          NotificationManager.error(err.statusText, 'failed to create package.')
        })
    },
  }
}

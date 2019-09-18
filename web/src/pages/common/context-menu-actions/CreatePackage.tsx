import { TreeNodeData } from '../../../components/tree-view/Tree'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import axios from 'axios'
import { DmtApi } from '../../../api/Api'
import Api2 from '../../../api/Api2'
import { getDataSourceIDFromAbsolutID } from '../../../util/helperFunctions'
import { TreeNodeBuilder } from '../tree-view/TreeNodeBuilder'

const api = new DmtApi()

export const createPackage = (props: {
  node: TreeNodeData
  addNode: Function
  setShowModal: Function
  documentType: 'root-package' | 'subpackage' | 'version' // version is not used
}): any => {
  const { node, addNode, documentType, setShowModal } = props
  return {
    fetchDocument: Api2.fetchCreatePackage,
    onSubmit: (formData: any) => {
      const datasourceId = getDataSourceIDFromAbsolutID(node.nodeId)
      const url = api.packagePost(datasourceId)
      if (node.isRoot) {
      }
      let templateRef = 'templates/package-template'
      if (documentType === 'subpackage') {
        templateRef = 'templates/subpackage-template'
      }
      axios
        .post(url, {
          parentId: node.nodeId,
          nodeType: 'folder',
          isRoot: false,
          formData,
          meta: {
            name: formData.title,
            templateRef,
            documentType,
          },
        })
        .then(res => {
          console.log(res)
          const treeNode = new TreeNodeBuilder(res.data)
            .setOpen(true)
            .buildFolderNode()

          addNode(treeNode, node.nodeId)
          setShowModal(false)
          NotificationManager.success(res.data.id, 'Package created')
        })
        .catch(err => {
          console.log(err)
          NotificationManager.error(err.statusText, 'failed to create package.')
        })
    },
  }
}

import { TreeNodeData } from '../../../components/tree-view/Tree'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import axios from 'axios'
import { DmtApi } from '../../../api/Api'
import Api2 from '../../../api/Api2'
import { getDataSourceIDFromAbsolutID } from '../../../util/helperFunctions'
import { TreeNodeBuilder } from '../tree-view/TreeNodeBuilder'
import { NodeType } from '../../../api/types'

const api = new DmtApi()

export const createSubpackage = (props: {
  treeNodeData: TreeNodeData
  addNode: Function
  setShowModal: Function
}): any => {
  const { treeNodeData, addNode, setShowModal } = props
  return {
    fetchDocument: Api2.fetchCreatePackage,
    onSubmit: (formData: any) => {
      const datasourceId = getDataSourceIDFromAbsolutID(treeNodeData.nodeId)
      const url = api.packagePost(datasourceId)
      const templateRef = 'templates/subpackage-template'

      axios
        .post(url, {
          parentId: treeNodeData.nodeId,
          formData,
          nodeType: NodeType.subPackage,
          meta: {
            name: formData.title,
            templateRef,
          },
        })
        .then(res => {
          console.log(res)
          const treeNode = new TreeNodeBuilder(res.data)
            .setOpen(true)
            .buildFolderNode()

          addNode(treeNode, treeNodeData.nodeId)
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

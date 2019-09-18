//@ts-ignore
import { NotificationManager } from 'react-notifications'
import axios from 'axios'
import { DmtApi } from '../../../api/Api'
import Api2 from '../../../api/Api2'
import { getDataSourceIDFromAbsolutID } from '../../../util/helperFunctions'
import { TreeNodeBuilder } from '../tree-view/TreeNodeBuilder'
import { NodeType } from '../../../api/types'
import { ContextMenuActionProps } from './ContextMenuActionsFactory'

const api = new DmtApi()

export const createPackage = (props: ContextMenuActionProps): any => {
  const { treeNodeData } = props
  return {
    fetchDocument: Api2.fetchCreatePackage,
    onSubmit: (formData: any) => {
      const datasourceId = getDataSourceIDFromAbsolutID(treeNodeData.nodeId)
      const url = api.packagePost(datasourceId)
      const templateRef = 'templates/package-template'
      const data = {
        parentId: '',
        formData,
        nodeType: NodeType.rootPackage,
        meta: {
          name: formData.title,
          documentType: NodeType.rootPackage,
          templateRef,
        },
      }
      postPackage({ ...props, url, data })
    },
  }
}

type PostPackage = {
  data: any
  url: string
  setShowModal: Function
  addNode: Function
}

//@todo move to api2. should generate data based on nodeType
export function postPackage({
  data,
  url,
  addNode,
  setShowModal,
}: PostPackage): void {
  axios
    .post(url, data)
    .then(res => {
      console.log(res)
      try {
        const treeNode = new TreeNodeBuilder(res.data)
          .setOpen(true)
          .buildFolderNode()

        addNode(treeNode, data.parentId)
        setShowModal(false)

        NotificationManager.success(treeNode.nodeId, 'Package created')
      } catch (err) {
        console.log(err)
      }
    })
    .catch(err => {
      console.log(err)
      NotificationManager.error(err.statusText, 'failed to create package.')
    })
}

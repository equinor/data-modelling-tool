//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { TreeNodeBuilderOld } from '../tree-view/TreeNodeBuilderOld'

type OnSuccessPostPackage = {
  treeNodeData: TreeNodeData
  setShowModal: Function
  addNode: Function
}

export function onSuccess({
  addNode,
  setShowModal,
  treeNodeData,
}: OnSuccessPostPackage) {
  return (res: any) => {
    try {
      const treeNode = new TreeNodeBuilderOld(res.data).setOpen(true).build()
      addNode(treeNode, treeNodeData.nodeId)
      setShowModal(false)
      NotificationManager.success(treeNode.nodeId, 'Package created')
    } catch (err) {
      console.log(err)
    }
  }
}

export function onError(err: any) {
  NotificationManager.error(
    err.statusText || 'Error',
    'failed to create package.'
  )
}

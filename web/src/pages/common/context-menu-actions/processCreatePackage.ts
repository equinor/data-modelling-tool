//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { TreeNodeBuilder } from '../tree-view/TreeNodeBuilder'
import { TreeNodeData } from '../../../components/tree-view/Tree'

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
      const treeNode = new TreeNodeBuilder(res.data)
        .setOpen(true)
        .buildFolderNode()
      addNode(treeNode, treeNodeData.nodeId)
      setShowModal(false)

      NotificationManager.success(treeNode.nodeId, 'Package created')
    } catch (err) {
      console.log(err)
    }
  }
}

export function onError(err: any) {
  console.log(err)
  NotificationManager.error(err.statusText, 'failed to create package.')
}

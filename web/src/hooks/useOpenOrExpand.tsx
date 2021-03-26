import {
  IDashboard,
  useDashboard,
} from '../context/dashboard/DashboardProvider'
import { IIndex, useIndex } from '../context/index/IndexProvider'
import { TreeNodeData } from '../components/tree-view/Tree'

export default function useOpenOrExpand() {
  const dashboard: IDashboard = useDashboard()
  const index: IIndex = useIndex()

  const openOrExpand = ({ nodeId, fetchUrl, indexUrl }: any) => {
    if (fetchUrl) {
      dashboard.models.layout.operations.add(
        fetchUrl.uid,
        fetchUrl.title,
        fetchUrl.component,
        fetchUrl.data
      )
      dashboard.models.layout.operations.focus(nodeId)
    }

    index.models.tree.operations.toggle(nodeId)
    const node: TreeNodeData = index.models.tree.operations.getNode(nodeId)
    if (indexUrl && node.isExpandable && !node.isOpen) {
      index.operations.add(nodeId, indexUrl)
    }
  }
  return openOrExpand
}

import { TreeNodeData } from '../../../../../components/tree-view/Tree'

export function toObject(acc: any, current: TreeNodeData) {
  ;(acc as any)[current.nodeId] = current
  return acc
}

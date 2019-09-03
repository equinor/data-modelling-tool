import { Datasource, IndexNode } from '../../../api/Api'
import { AddNode, UpdateNode } from '../tree-view/DocumentTree'
import { TreeNodeData } from '../../../components/tree-view/Tree'

export type ContextMenuActionProps = {
  node: TreeNodeData
  datasource: Datasource
  addNode: AddNode
  updateNode: UpdateNode
  setShowModal: (open: boolean) => void
}

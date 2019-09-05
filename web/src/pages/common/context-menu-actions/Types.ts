import { Datasource, IndexNode } from '../../../api/Api'
import { AddNode, UpdateNode } from '../tree-view/DocumentTree'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import { FormProps } from '../../../components/Form'

export type ContextMenuActionProps = {
  node: TreeNodeData
  datasource: Datasource
  addNode: AddNode
  updateNode: UpdateNode
  setShowModal: (open: boolean) => void
}

export type NodeMenuItem = {
  action: string
  label: string
}

export type ActionConfig = {
  menuItem: NodeMenuItem
  formProps: FormProps
}

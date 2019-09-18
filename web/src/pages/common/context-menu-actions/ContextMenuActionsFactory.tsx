import { createBlueprint } from './CreateBlueprint'
import { editPackage } from './EditPackage'
import { createPackage } from './CreatePackage'
import { createSubpackage } from './CreateSubpackage'
import { TreeNodeData } from '../../../components/tree-view/Tree'

export enum ContextMenuActions {
  createBlueprint = 'New Blueprint',
  createRootPackage = 'New Package',
  createSubPackage = 'New Subpackage',
  editPackage = 'Edit Package',
  editDataSource = 'Edit Data Source',
  addBlueprint = 'Add Blueprint',
}

export type ContextMenuActionProps = {
  treeNodeData: TreeNodeData
  addNode: Function
  setShowModal: Function
  updateNode: Function
}

const getFormProperties = (type: string, props: ContextMenuActionProps) => {
  switch (type) {
    case ContextMenuActions.createBlueprint: {
      const { treeNodeData, addNode, setShowModal } = props
      return createBlueprint({
        node: treeNodeData,
        addNode,
        setShowModal,
      })
    }
    case ContextMenuActions.createRootPackage: {
      return createPackage(props)
    }
    case ContextMenuActions.createSubPackage: {
      console.log(props)
      return createSubpackage(props)
    }
    case ContextMenuActions.editPackage: {
      const { treeNodeData, updateNode, setShowModal } = props
      return editPackage({
        node: treeNodeData,
        updateNode,
        setShowModal,
      })
    }
    case ContextMenuActions.addBlueprint: {
      const { treeNodeData } = props
      console.log(treeNodeData)
      return
    }
    default:
      return {
        schemaUrl: '',
        dataUrl: '',
        onSubmit: () => {},
      }
  }
}

export class ContextMenuActionsFactory {
  getActionConfig(type: string, props: ContextMenuActionProps) {
    return {
      formProps: getFormProperties(type, props),
      action: type,
    }
  }
}

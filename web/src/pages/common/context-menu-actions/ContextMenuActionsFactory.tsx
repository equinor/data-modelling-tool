import { createBlueprint } from './CreateBlueprint'
import { editPackage } from './EditPackage'
import { createPackage } from './CreatePackage'
import { createSubpackage } from './CreateSubpackage'

export enum ContextMenuActions {
  createBlueprint = 'New Blueprint',
  createRootPackage = 'New Package',
  createSubPackage = 'New Subpackage',
  editPackage = 'Edit Package',
  editDataSource = 'Edit Data Source',
  addBlueprint = 'Add Blueprint',
}

const getFormProperties = (type: string, props: any) => {
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
      const { treeNodeData, addNode, setShowModal } = props
      return createPackage({
        treeNodeData,
        addNode,
        setShowModal,
      })
    }
    case ContextMenuActions.createSubPackage: {
      const { node, addNode, setShowModal } = props
      return createSubpackage({
        treeNodeData: node,
        addNode,
        setShowModal,
      })
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
  getActionConfig(type: string, props: any) {
    return {
      formProps: getFormProperties(type, props),
      action: type,
    }
  }
}

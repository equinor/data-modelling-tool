import { createBlueprint } from './CreateBlueprint'
import { editPackage } from './EditPackage'
import { createPackage } from './CreatePackage'

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
      const { node, addNode, setShowModal } = props
      return createBlueprint({
        node,
        addNode,
        setShowModal,
      })
    }
    case ContextMenuActions.createRootPackage: {
      const { node, addNode, setShowModal } = props
      return createPackage({
        node,
        documentType: 'root-package',
        addNode,
        setShowModal,
      })
    }
    case ContextMenuActions.createSubPackage: {
      const { node, addNode, setShowModal } = props
      return createPackage({
        node,
        documentType: 'subpackage',
        addNode,
        setShowModal,
      })
    }
    case ContextMenuActions.editPackage: {
      const { node, updateNode, setShowModal } = props
      return editPackage({
        node,
        updateNode,
        setShowModal,
      })
    }
    case ContextMenuActions.addBlueprint: {
      const { node } = props
      console.log(node)
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

import { createBlueprint } from './CreateBlueprint'
import { editPackage } from './EditPackage'
import { createPackage } from './CreatePackage'

export enum ContextMenuActions {
  createBlueprint = 'New Blueprint',
  createPackage = 'New Package',
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
    case ContextMenuActions.createPackage: {
      const { node, addNode, setShowModal } = props
      return createPackage({
        node,
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

//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { onError, onSuccess } from './processCreatePackage'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import Api2 from '../../../api/Api2'
import { NodeType } from '../../../api/types'
import { TreeNodeBuilder } from '../tree-view/TreeNodeBuilder'
import axios from 'axios'
import { DmtApi } from '../../../api/Api'
const api = new DmtApi()

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
  const { treeNodeData, addNode, setShowModal } = props
  switch (type) {
    case ContextMenuActions.createBlueprint: {
      return {
        fetchDocument: Api2.fetchCreateBlueprint,
        onSubmit: (formData: any) => {
          Api2.postPackage({
            parentId: treeNodeData.nodeId,
            nodeType: NodeType.file,
            formData,
            onSuccess: (res: any) => {
              const newTreeNode: TreeNodeData = new TreeNodeBuilder(
                res.data
              ).buildFileNode()
              addNode(newTreeNode, treeNodeData.nodeId)
              setShowModal(false)
            },
            onError: (err: any) => console.error(Object.keys(err)),
          })
        },
      }
    }
    case ContextMenuActions.createRootPackage: {
      return {
        fetchDocument: Api2.fetchCreatePackage,
        onSubmit: (formData: any) => {
          Api2.postPackage({
            parentId: props.treeNodeData.nodeId,
            nodeType: NodeType.rootPackage,
            templateRef: 'templates/package-template',
            formData,
            onSuccess: onSuccess(props),
            onError: onError,
          })
        },
      }
    }
    case ContextMenuActions.createSubPackage: {
      return {
        fetchDocument: Api2.fetchCreatePackage,
        onSubmit: (formData: any) => {
          Api2.postPackage({
            nodeType: NodeType.subPackage,
            formData,
            parentId: props.treeNodeData.nodeId,
            templateRef: 'templates/subpackage-template',
            onSuccess: onSuccess(props),
            onError: onError,
          })
        },
      }
    }
    case ContextMenuActions.editPackage: {
      return {
        fetchDocument: Api2.fetchDocument(treeNodeData.nodeId),
        onSubmit: (formData: any) => {
          const url = api.documentPut(treeNodeData.nodeId)
          axios
            .put(url, formData)
            .then(() => {
              props.updateNode({ ...treeNodeData, title: formData.title })
              setShowModal(false)
              NotificationManager.success(
                formData.title,
                'Updated package title'
              )
            })
            .catch((e: any) => {
              console.log(e)
            })
        },
      }
    }
    case ContextMenuActions.addBlueprint: {
      const { treeNodeData } = props
      console.log(treeNodeData)
      return {
        onSubmit: () => {},
      }
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

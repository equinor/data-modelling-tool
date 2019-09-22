//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import Api2 from '../../../api/Api2'
import { TreeNodeBuilder } from '../tree-view/TreeNodeBuilderOld'
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
  removeFile = 'Remove',
}

export type ContextMenuActionProps = {
  treeNodeData: TreeNodeData
  addNode: Function
  setShowModal: Function
  removeNode: Function
  updateNode: Function
  layout?: any
}

const getFormProperties = (type: string, props: ContextMenuActionProps) => {
  const { treeNodeData, addNode, setShowModal, removeNode, layout } = props
  switch (type) {
    case ContextMenuActions.createBlueprint: {
      return {
        fetchDocument: Api2.fetchCreateBlueprint,
        onSubmit: (formData: any) => {
          Api2.addBlueprintFile({
            nodeId: treeNodeData.nodeId,
            filename: formData.title,
            onSuccess: (res: any, dataSourceId: string) => {
              const node: TreeNodeData = new TreeNodeBuilder({
                id: `${dataSourceId}/${res.id}`,
                filename: res.filename,
                nodeType: res.documentType,
              })
                .setOpen(true)
                .build()
              addNode(node, treeNodeData.nodeId)
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
          Api2.addRootPackage({
            nodeId: treeNodeData.nodeId,
            filename: formData.title,
            onSuccess: (res: any, dataSourceId: string) => {
              const node: TreeNodeData = new TreeNodeBuilder({
                id: `${dataSourceId}/${res.id}`,
                filename: res.filename,
                nodeType: res.documentType,
              })
                .setOpen(true)
                .build()
              addNode(node, treeNodeData.nodeId)
              setShowModal(false)
            },
            onError: (err: any) => console.error(Object.keys(err)),
          })
        },
      }
    }
    case ContextMenuActions.createSubPackage: {
      return {
        fetchDocument: Api2.fetchCreatePackage,
        onSubmit: (formData: any) => {
          Api2.addSubPackage({
            nodeId: treeNodeData.nodeId,
            filename: formData.title,
            onSuccess: (res: any, dataSourceId: string) => {
              const node: TreeNodeData = new TreeNodeBuilder({
                id: `${dataSourceId}/${res.id}`,
                filename: res.filename,
                nodeType: res.documentType,
              })
                .setOpen(true)
                .build()
              addNode(node, treeNodeData.nodeId)
              setShowModal(false)
            },
            onError: (err: any) => console.error(Object.keys(err)),
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
    //@todo remove?
    case ContextMenuActions.addBlueprint: {
      const { treeNodeData } = props
      console.log(treeNodeData)
      return {
        onSubmit: () => {},
      }
    }
    case ContextMenuActions.removeFile: {
      const { treeNodeData } = props
      return {
        fetchDocument: Api2.fetchRemoveFile,
        onSubmit: () => {
          Api2.removeFile({
            nodeId: treeNodeData.nodeId,
            filename: treeNodeData.title,
            onSuccess: (res: any, parentId: string) => {
              removeNode(treeNodeData.nodeId, parentId)
              layout.remove(treeNodeData.nodeId)
            },
            onError: (err: any) => console.error(Object.keys(err)),
          })
        },
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

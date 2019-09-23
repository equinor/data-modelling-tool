//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { onError, onSuccess } from './processCreatePackage'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import Api2 from '../../../api/Api2'
import { TreeNodeBuilder } from '../tree-view/TreeNodeBuilderOld'
import axios from 'axios'
import { DmtApi } from '../../../api/Api'
import { LayoutComponents } from '../golden-layout/LayoutContext'

const api = new DmtApi()

export enum ContextMenuActions {
  createBlueprint = 'New Blueprint',
  createRootPackage = 'New Package',
  createSubPackage = 'New Subpackage',
  editPackage = 'Edit Package',
  editDataSource = 'Edit Data Source',
  addBlueprint = 'Add Blueprint',
  removeFile = 'Remove File',
  removeSubPackage = 'Remove Subpackage',
  renameFile = 'Rename file',
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
          const url = api.updateDocument(treeNodeData.nodeId)
          axios
            .put(url, formData)
            .then(() => {
              props.updateNode({ ...treeNodeData, title: formData.title })
              // setShowModal(false)
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
    case ContextMenuActions.renameFile: {
      const { treeNodeData } = props
      return {
        fetchDocument: Api2.fetchCreateBlueprint,
        onSubmit: (formData: any) => {
          const packageId = treeNodeData.nodeId.substring(
            0,
            treeNodeData.nodeId.lastIndexOf('/')
          )
          const parentId = `${packageId}/package`
          Api2.moveFile({
            source: treeNodeData.nodeId,
            destination: `${packageId}/${formData.title}`,
            onSuccess: (res: any) => {
              const dataSourceId = treeNodeData.nodeId.split('/')[0]
              const newNodeId = `${dataSourceId}/${res.id}`

              // Remove old node
              removeNode(treeNodeData.nodeId, parentId)

              // Add new node
              const node: TreeNodeData = new TreeNodeBuilder({
                id: newNodeId,
                filename: res.filename,
                nodeType: res.documentType,
              })
                .setOpen(true)
                .build()
              addNode(node, parentId)

              NotificationManager.success(formData.title, 'Renamed')

              layout.remove(treeNodeData.nodeId)

              const data = {
                selectedDocumentId: newNodeId,
              }
              layout.add(
                newNodeId,
                res.filename,
                LayoutComponents.blueprint,
                data
              )
            },
            onError: (err: any) => console.error(Object.keys(err)),
          })
        },
      }
    }
    case ContextMenuActions.removeSubPackage: {
      const { treeNodeData } = props
      return {
        fetchDocument: Api2.fetchRemoveFile,
        onSubmit: () => {
          Api2.removeSubPackage({
            nodeId: treeNodeData.nodeId,
            filename: treeNodeData.title,
            onSuccess: (res: any, parentId: string) => {
              removeNode(treeNodeData.nodeId, parentId)
              // TODO: Return list of deleted ids?
              // layout.remove(treeNodeData.nodeId)
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

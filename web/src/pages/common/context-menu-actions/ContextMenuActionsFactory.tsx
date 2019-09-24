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
  renameSubPackage = 'Rename Subpackage',
  editPackage = 'Edit Package',
  editDataSource = 'Edit Data Source',
  addBlueprint = 'Add Blueprint',
  removeFile = 'Remove File',
  removeSubPackage = 'Remove Subpackage',
  renameFile = 'Rename file',
  removeRootPackage = 'Remove Package',
  renameRootPackage = 'Rename Package',
}

export type ContextMenuActionProps = {
  treeNodeData: TreeNodeData
  addNode: Function
  setShowModal: Function
  removeNode: Function
  updateNode: Function
  replaceNode: Function
  layout?: any
  path: string
  parent: string
}

const getFormProperties = (type: string, props: ContextMenuActionProps) => {
  const {
    treeNodeData,
    addNode,
    setShowModal,
    removeNode,
    layout,
    replaceNode,
    path,
    parent,
  } = props

  const showError = (error: any) => {
    console.log(error)
    NotificationManager.error(error.response.data.message, 'Failed')
  }

  const dataSourceId = path.split('/')[0]
  const nodeId = treeNodeData.nodeId.replace(`${dataSourceId}/`, '')

  switch (type) {
    case ContextMenuActions.createBlueprint: {
      return {
        fetchDocument: Api2.fetchCreateBlueprint,
        onSubmit: (formData: any) => {
          Api2.addBlueprintFile({
            dataSourceId: dataSourceId,
            // The parent is node the itself
            parentId: nodeId,
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
        fetchDocument: Api2.fetchCreateBlueprint,
        onSubmit: (formData: any) => {
          Api2.addSubPackage({
            dataSourceId: dataSourceId,
            // The parent is node the itself
            parentId: nodeId,
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
      const basePath = props.path
      const dataSourceId = basePath.split('/')[0]
      return {
        fetchDocument: Api2.fetchRemoveFile,
        onSubmit: () => {
          Api2.removeFile({
            dataSourceId: dataSourceId,
            filename: `${basePath}/${treeNodeData.title}`.replace(
              `${dataSourceId}/`,
              ''
            ),
            onSuccess: () => {
              removeNode(treeNodeData.nodeId, props.parent)
              layout.remove(treeNodeData.nodeId)
            },
            onError: (error: any) => showError(error),
          })
        },
      }
    }
    case ContextMenuActions.renameFile: {
      const { treeNodeData } = props
      return {
        fetchDocument: Api2.fetchCreateBlueprint,
        onSubmit: (formData: any) => {
          const basePath = props.path
          Api2.moveFile({
            source: `${basePath}/${treeNodeData.title}`,
            destination: `${basePath}/${formData.title}`,
            onSuccess: (res: any) => {
              // Set title in tree
              props.updateNode({ ...treeNodeData, title: res.filename })
              // Set title in layout
              layout.update(treeNodeData.nodeId, res.filename)
              NotificationManager.success(res.filename, 'Renamed')
              setShowModal(false)
            },
            onError: (error: any) => showError(error),
          })
        },
      }
    }
    case ContextMenuActions.renameSubPackage: {
      const { treeNodeData } = props
      return {
        fetchDocument: Api2.fetchCreateBlueprint,
        onSubmit: (formData: any) => {
          const basePath = props.path
          Api2.moveSubPackage({
            source: `${basePath}/${treeNodeData.title}`,
            destination: `${basePath}/${formData.title}`,
            onSuccess: (res: any) => {
              // Set title in tree
              props.updateNode({ ...treeNodeData, title: res.filename })
              NotificationManager.success(res.filename, 'Renamed')
              setShowModal(false)
            },
            onError: (error: any) => showError(error),
          })
        },
      }
    }
    case ContextMenuActions.removeSubPackage: {
      const { treeNodeData } = props
      const basePath = props.path
      const dataSourceId = basePath.split('/')[0]
      return {
        fetchDocument: Api2.fetchRemoveFile,
        onSubmit: () => {
          Api2.removeSubPackage({
            dataSourceId: dataSourceId,
            filename: `${basePath}/${treeNodeData.title}`.replace(
              `${dataSourceId}/`,
              ''
            ),
            onSuccess: (response: any) => {
              response.removedChildren.forEach((removedChildId: string) => {
                layout.remove(`${dataSourceId}/${removedChildId}`)
              })
              removeNode(treeNodeData.nodeId, parent)
            },
            onError: (err: any) => console.error(Object.keys(err)),
          })
        },
      }
    }
    case ContextMenuActions.removeRootPackage: {
      const { treeNodeData } = props
      return {
        fetchDocument: Api2.fetchRemoveFile,
        onSubmit: () => {
          Api2.removeRootPackage({
            nodeId: treeNodeData.nodeId,
            onSuccess: (res: any, parentId: string) => {
              removeNode(treeNodeData.nodeId, props.parent)
              // TODO: Return list of deleted ids?
              // layout.remove(treeNodeData.nodeId)
            },
            onError: (err: any) => console.error(Object.keys(err)),
          })
        },
      }
    }
    case ContextMenuActions.renameRootPackage: {
      const { treeNodeData } = props
      return {
        fetchDocument: Api2.fetchCreateBlueprint,
        onSubmit: (formData: any) => {
          const parts = treeNodeData.nodeId.split('/')
          parts.pop()
          parts.pop()
          const source = `${parts.join('/')}/package`
          const sourceNode = `${parts.join('/')}/1.0.0/package`
          parts.pop()
          const destination = `${parts.join('/')}/${formData.title}/package`
          const destinationNode = `${parts.join('/')}/${
            formData.title
          }/1.0.0/package`

          Api2.moveRootPackage({
            source: source,
            destination: destination,
            onSuccess: (res: any) => {
              const dataSourceId = treeNodeData.nodeId.split('/')[0]
              replaceNode(
                dataSourceId,
                sourceNode,
                destinationNode,
                res.filename
              )

              /*
              // Remove old node
              removeNode(treeNodeData.nodeId, parentId)

              // Add new node (TODO: what about children)
              const node: TreeNodeData = new TreeNodeBuilder({
                id: newNodeId,
                filename: res.filename,
                nodeType: res.documentType,
                // children: treeNodeData.children || []
              })
                .setOpen(true)
                .build()

              addNode(node, parentId)
              */
              NotificationManager.success(formData.title, 'Renamed')
            },
            onError: (error: any) => showError(error),
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

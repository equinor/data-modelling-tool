//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { TreeNodeData } from '../../../components/tree-view/Tree'
import Api2 from '../../../api/Api2'
import {
  TreeNodeBuilder,
  TreeNodeBuilderOld,
} from '../tree-view/TreeNodeBuilderOld'
import axios from 'axios'
import { DmtApi } from '../../../api/Api'
import { DocumentData } from '../../blueprints/blueprint/FetchDocument'
import { BlueprintPickerContent } from '../../entities/BlueprintPicker'
import React from 'react'
import values from 'lodash/values'

const api = new DmtApi()

export enum ContextMenuActions {
  createBlueprint = 'New Blueprint',
  createRootPackage = 'New Package',
  createSubPackage = 'New Subpackage',
  renameSubPackage = 'Rename Subpackage',
  editPackage = 'Edit Package',
  editDataSource = 'Edit Data Source',
  addBlueprint = 'Select Blueprint',
  removeFile = 'Remove File',
  removeSubPackage = 'Remove Subpackage',
  renameFile = 'Rename file',
  removeRootPackage = 'Remove Package',
  renameRootPackage = 'Rename Package',
  ADD_ITEM_TO_ARRAY = 'Add Item To Array',
  addEntity = 'Add something...',
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

const getFormProperties = (action: any, props: ContextMenuActionProps) => {
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
  const [dataSourceId, nodeId] = treeNodeData.nodeId.split('/')
  //const dataSourceId = path.split('/')[0]
  //const nodeId = treeNodeData.nodeId.replace(`${dataSourceId}/`, '')

  switch (action.type) {
    case ContextMenuActions.addEntity: {
      const [dataSourceId, nodeId] = treeNodeData.nodeId.split('/')
      const [selectedDocumentId, attribute] = nodeId.split('_')

      return {
        fetchDocument: Api2.fetchJsonSchema(action.data.templateRef),
        onSubmit: (formData: any) => {
          const isContained = formData.contained
          console.log(isContained)
          if (isContained) {
            const url = api.updateDocument(
              `${dataSourceId}/${selectedDocumentId}/${attribute}`
            )
            axios
              .put(url, formData)
              .then((response: any) => {
                const responseData: DocumentData = response.data
                NotificationManager.success(
                  responseData.document.id,
                  'Updated blueprint'
                )
              })
              .catch((e: any) => {
                NotificationManager.error(
                  'Failed to update blueprint',
                  'Updated blueprint'
                )
              })
          } else {
            Api2.addBlueprintFile({
              dataSourceId: dataSourceId,
              parentId: `${selectedDocumentId}`,
              filename: formData.name,
              templateRef: action.data.templateRef,
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

                const url = api.updateDocument(
                  `${dataSourceId}/${selectedDocumentId}/${attribute}`
                )
                let formData: any = [res.id]
                axios
                  .put(url, formData)
                  .then((response: any) => {
                    const responseData: DocumentData = response.data
                    NotificationManager.success(
                      responseData.document.id,
                      'Updated blueprint'
                    )
                    // dispatch(DocumentActions.viewFile(documentId))
                  })
                  .catch((e: any) => {
                    NotificationManager.error(
                      'Failed to update blueprint',
                      'Updated blueprint'
                    )
                  })
              },
              onError: (err: any) => console.error(Object.keys(err)),
            })
          }
        },
      }
    }

    case ContextMenuActions.ADD_ITEM_TO_ARRAY: {
      const { meta } = treeNodeData

      const {
        itemName = '',
        itemType = '',
        attribute = '',
        parentId = '',
        dataSourceId = '',
      } = meta as any

      return {
        fetchDocument: Api2.fetchJsonSchema(itemType),
        onSubmit: (formData: any) => {
          console.log(`ADD ITEM OF TYPE ${itemName} TO ARRAY`)

          Api2.addFile({
            dataSourceId: dataSourceId,
            parentId: parentId,
            filename: formData.name,
            templateRef: itemType,
            attribute: attribute,
            path: path,
            onSuccess: (result: any, dataSourceId: string) => {
              const nodes: any = values(result)
              nodes.forEach((item: any, index: number) => {
                delete item['children']
                const node = new TreeNodeBuilderOld(item).build()
                if (index == 0) {
                  addNode(node, treeNodeData.nodeId)
                } else {
                  addNode(node, item.parentId)
                }
              })
              setShowModal(false)

              // TODO: Add node
              /*
                            const node: TreeNodeData = new TreeNodeBuilder({
                                id: `${dataSourceId}/${result.id}`,
                                filename: result.name,
                                nodeType: result.nodeType,
                            })
                                .setOpen(true)
                                .build()
                            addNode(node, `${dataSourceId}/${result.parentId}`)
                            setShowModal(false)
                             */
              //const url = api.updateDocument(`${dataSourceId}/${selectedDocumentId}/${attribute}`)
              //const url = api.updateDocument(`${dataSourceId}/${res.id}`)
              // let formData: any = [res.filename] // TODO: What about id?
              /*
                            axios
                                .put(url, formData)
                                .then((response: any) => {
                                    const responseData: DocumentData = response.data
                                    NotificationManager.success(
                                        responseData.document.id,
                                        'Updated blueprint'
                                    )
                                    // dispatch(DocumentActions.viewFile(documentId))
                                })
                                .catch((e: any) => {
                                    NotificationManager.error(
                                        'Failed to update blueprint',
                                        'Updated blueprint'
                                    )
                                })
                             */
            },
            onError: (err: any) => console.error(Object.keys(err)),
          })
        },
      }
    }
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
        fetchDocument: Api2.fetchCreateBlueprint,
        onSubmit: (formData: any) => {
          Api2.addRootPackage({
            dataSourceId: treeNodeData.nodeId,
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
  getActionConfig(action: any, props: ContextMenuActionProps) {
    return {
      formProps: getFormProperties(action, props),
      action: action.type,
    }
  }
}

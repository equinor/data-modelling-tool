import React, { useContext } from 'react'
import {
  ApplicationContext,
  NodeType,
  Tree,
  TreeNodeRenderProps,
} from '@dmt/common'
import { DocumentNode } from './DocumentNode'
import {
  ContextMenuActions,
  DeleteAction,
  DownloadAction,
  IInsertReferenceProps,
  InsertReference,
  DefaultCreate,
  SaveToExistingDocument,
  RenameDocument,
} from './DocumentActions'
import ContextMenu from '../../../components/context-menu/ContextMenu'
import { useModalContext } from '../../../context/modal/ModalContext'
import useExplorer from '../../../hooks/useExplorer'
import useRunnable, { ActionTypes } from '../../../hooks/useRunnable'
import {
  IGlobalIndex,
  useGlobalIndex,
} from '../../../context/global-index/IndexProvider'
import { getUIPlugin } from '@dmt/core-plugins'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { AuthContext } from '../../../../../../app/src/context/auth/AuthContext'
export default () => {
  const index: IGlobalIndex = useGlobalIndex()
  const explorer = useExplorer({})
  const { openModal } = useModalContext()
  const { runAndSaveToNewDocument } = useRunnable({ explorer })
  const { token } = useContext(AuthContext)
  const application = useContext(ApplicationContext)
  const handleToggle = (props: any) => {
    explorer.toggle({
      nodeId: props.nodeData.nodeId,
    })
  }

  const handleOpen = (props: any) => {
    if (
      [NodeType.PACKAGE, NodeType.DATA_SOURCE].includes(
        props.nodeData.meta.type
      )
    ) {
      explorer.toggle({
        nodeId: props.nodeData.nodeId,
      })
    } else {
      explorer.open({
        dataSourceId: props.nodeData.meta.dataSource,
        nodeId: props.nodeData.nodeId,
        fetchUrl: props.nodeData.meta.fetchUrl,
      })
    }
  }

  const handleAction = (
    id: any,
    action: string,
    data: any,
    label: string,
    node: TreeNodeRenderProps
  ) => {
    const actionInputData = {
      action: {
        node: node,
        action: { type: action, data },
      },
    }

    const ExternalPlugin = getUIPlugin('default-form')

    switch (action) {
      case ContextMenuActions.CREATE:
        const createProps = {
          explorer: explorer,
          type: `${data.request.type}`,
          uiRecipeName: 'DEFAULT_CREATE',
          request: data.request,
          url: data.url,
          nodeUrl: data.nodeUrl,
        }
        openModal(DefaultCreate, {
          dialog: {
            title: `Create new ${data.request.attribute} for ${node.nodeData.title}`,
          },
          props: createProps,
        })
        break
      case ContextMenuActions.UPDATE:
        const dataSourceId: string | undefined = node.nodeData.meta.dataSource
        const documentId: string = node.nodeData.nodeId

        const renameProps = {
          explorer: explorer,
          nodeUrl: data.nodeUrl,
          node: node,
          dataSourceId: dataSourceId,
          documentId: documentId,
        }
        openModal(RenameDocument, {
          dialog: { title: `Rename ${node.nodeData.nodeId}` },
          props: renameProps,
        })
        break
      case ContextMenuActions.DELETE: {
        openModal(DeleteAction, {
          dialog: { title: `Delete ${node.nodeData.nodeId}` },
          props: actionInputData,
        })
        break
      }
      case ContextMenuActions.DOWNLOAD:
        openModal(DownloadAction, {
          dialog: { title: `Download ${node.nodeData.nodeId}` },
          props: actionInputData,
        })
        break
      case ContextMenuActions.INSERT_REFERENCE:
        const insertReferenceProps: IInsertReferenceProps = {
          explorer,
          attribute: data,
          // TODO: Fetch blueprint and set correct type for the reference
          type: 'Placeholder',
          target: id,
          // @ts-ignore
          targetDataSource: node.nodeData.meta.dataSource,
        }
        openModal(InsertReference, {
          dialog: {
            title: `Select Entity to include as ${node.nodeData.title}'s ${data}`,
          },
          props: insertReferenceProps,
        })
        break
      case ContextMenuActions.UNLINK:
        explorer.removeReference({
          // @ts-ignore
          dataSourceId: node.nodeData.meta.dataSource,
          documentDottedId: node.nodeData.nodeId,
        })
        break
      case ContextMenuActions.RUNNABLE:
        switch (data.actionType) {
          case ActionTypes.resultInEntity:
            openModal(
              ({ action }: any) =>
                SaveToExistingDocument({
                  node: action.node,
                  action: action.action.data,
                  explorer: explorer,
                }),
              {
                dialog: { title: `Run action` },
                props: actionInputData,
              }
            )
            break
          case ActionTypes.separateResultFile:
            const handleSubmit = async (formData: any) => {
              await runAndSaveToNewDocument(
                // @ts-ignore
                node.nodeData.meta.dataSource,
                node.nodeData.nodeId,
                node.path,
                formData,
                data.output,
                data.method,
                token
              )
            }
            const separateResultFileProps = {
              explorer: explorer,
              type: 'DMT-Internal/DMT/actions/NewActionResult',
              uiRecipeName: 'DEFAULT_CREATE',
              onSubmit: handleSubmit,
            }
            openModal(ExternalPlugin, {
              dialog: { title: `Run command ${node.nodeData.nodeId}` },
              props: separateResultFileProps,
            })
            break
          default:
            const message = `No valid 'actionType' is defined for action '${data.runnable.name}'`
            console.error(message)
            NotificationManager.error(message, 'Action Failed')
        }
    }
  }

  return (
    <>
      <Tree
        state={index.models.index.models.tree.models.tree}
        operations={index.models.index.models.tree.operations}
        dataSources={application?.visibleDataSources}
      >
        {(node: TreeNodeRenderProps) => {
          return (
            <ContextMenu
              id={node.nodeData.nodeId}
              menuItems={node.nodeData.meta.menuItems}
              onClick={(id: any, action: string, data: any, label: string) =>
                handleAction(id, action, data, label, node)
              }
            >
              <DocumentNode
                onToggle={() => handleToggle(node)}
                onOpen={() => handleOpen(node)}
                node={node}
              />
            </ContextMenu>
          )
        }}
      </Tree>
    </>
  )
}

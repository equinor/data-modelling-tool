import React from 'react'
import { NodeType, Tree, TreeNodeRenderProps } from '@dmt/common'
import { DocumentNode } from './DocumentNode'
import {
  ContextMenuActions,
  DeleteAction,
  DownloadAction,
  formDataGivenByRequest,
  IInsertReferenceProps,
  InsertReference,
  DefaultCreate,
  SaveToExistingDocument,
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

export default () => {
  const index: IGlobalIndex = useGlobalIndex()
  const explorer = useExplorer({})
  const { openModal } = useModalContext()
  const { runAndSaveToNewDocument } = useRunnable()

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
        const updateProps = {
          explorer: explorer,
          uiRecipeName: 'DEFAULT_CREATE',
          dataSourceId: node.nodeData.meta.dataSource,
          documentId: node.nodeData.nodeId,
          onSubmit: (formData: any) => {
            if (formData.description === undefined) {
              formData.description = ''
            }
            const output = formDataGivenByRequest(data.request, formData)
            explorer.update({
              data: output,
              updateUrl: data.url,
              nodeUrl: data.nodeUrl,
            })
          },
        }
        openModal(ExternalPlugin, {
          dialog: { title: `Update ${node.nodeData.nodeId}` },
          props: updateProps,
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
          attribute: data.request.attribute,
          // TODO: Fetch blueprint and set correct type for the reference
          type: 'Placeholder',
          target: id,
          // @ts-ignore
          targetDataSource: node.nodeData.meta.dataSource,
        }
        openModal(InsertReference, {
          dialog: {
            title: `Select Entity to include as ${node.nodeData.title}'s ${data.request.attribute}`,
          },
          props: insertReferenceProps,
        })
        break
      case ContextMenuActions.RUNNABLE:
        switch (data.runnable.actionType) {
          case ActionTypes.resultInEntity:
            openModal(SaveToExistingDocument, {
              dialog: { title: `Runnable` },
              props: actionInputData,
            })
            break
          case ActionTypes.separateResultFile:
            const handleSubmit = async (formData: any) => {
              const outputType = data.runnable.output
              await runAndSaveToNewDocument(
                data.dataSourceId,
                data.documentId,
                node.path,
                formData,
                outputType,
                data.runnable.method
              )
            }
            const separateResultFileProps = {
              explorer: explorer,
              type: 'apps/DMT/actions/NewActionResult', //'`${data.request.type}`,
              uiRecipeName: 'DEFAULT_CREATE',
              onSubmit: handleSubmit,
            }
            openModal(ExternalPlugin, {
              dialog: { title: `Run command ${node.nodeData.nodeId}` },
              props: separateResultFileProps,
            })
            break
        }
    }
  }

  return (
    <>
      <Tree
        state={index.models.index.models.tree.models.tree}
        operations={index.models.index.models.tree.operations}
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

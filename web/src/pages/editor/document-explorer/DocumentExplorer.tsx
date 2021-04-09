import React from 'react'
import Tree from '../../../components/tree-view/Tree'
import { TreeNodeRenderProps } from '../../../components/tree-view/TreeNode'
import { DocumentNode } from './DocumentNode'
import {
  ContextMenuActions,
  CreateAction,
  DeleteAction,
  DownloadAction,
  SaveToExistingDocument,
  SaveToNewDocument,
  UpdateAction,
} from './DocumentActions'
import ContextMenu from '../../../components/context-menu/ContextMenu'
import { useModalContext } from '../../../context/modal/ModalContext'
import useExplorer from '../../../hooks/useExplorer'
import { NodeType } from '../../../utils/variables'
import { ActionTypes } from '../../../hooks/useRunnable'
import {
  IGlobalIndex,
  useGlobalIndex,
} from '../../../context/global-index/IndexProvider'

export default () => {
  const index: IGlobalIndex = useGlobalIndex()
  const { toggle, open } = useExplorer({})
  const { openModal } = useModalContext()

  const handleToggle = (props: any) => {
    toggle({
      nodeId: props.nodeData.nodeId,
    })
  }

  const handleOpen = (props: any) => {
    if (
      [NodeType.PACKAGE, NodeType.DATA_SOURCE].includes(
        props.nodeData.meta.type
      )
    ) {
      toggle({
        nodeId: props.nodeData.nodeId,
      })
    } else {
      open({
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
    props: any
  ) => {
    const actionInputData = {
      action: {
        node: props,
        action: { type: action, data },
      },
    }

    switch (action) {
      case ContextMenuActions.CREATE:
        openModal(CreateAction, {
          dialog: { title: `Create ${label}` },
          props: actionInputData,
        })
        break
      case ContextMenuActions.UPDATE:
        openModal(UpdateAction, {
          dialog: { title: `Update ${props.nodeData.nodeId}` },
          props: actionInputData,
        })
        break
      case ContextMenuActions.DELETE: {
        openModal(DeleteAction, {
          dialog: { title: `Delete ${props.nodeData.nodeId}` },
          props: actionInputData,
        })
        break
      }
      case ContextMenuActions.DOWNLOAD:
        openModal(DownloadAction, {
          dialog: { title: `Download ${props.nodeData.nodeId}` },
          props: actionInputData,
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
            openModal(SaveToNewDocument, {
              dialog: { title: `Run command ${props.nodeData.nodeId}` },
              props: actionInputData,
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
        {(props: TreeNodeRenderProps) => {
          return (
            <ContextMenu
              id={props.nodeData.nodeId}
              menuItems={props.nodeData.meta.menuItems}
              onClick={(id: any, action: string, data: any, label: string) =>
                handleAction(id, action, data, label, props)
              }
            >
              <DocumentNode
                onToggle={() => handleToggle(props)}
                onOpen={() => handleOpen(props)}
                node={props}
              />
            </ContextMenu>
          )
        }}
      </Tree>
    </>
  )
}

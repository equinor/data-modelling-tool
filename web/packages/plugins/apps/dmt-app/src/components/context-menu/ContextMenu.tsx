import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  Scrim,
  Typography,
  Input,
  Label,
} from '@equinor/eds-core-react'
import './react-contextmenu.css'
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu'
import {
  AuthContext,
  BlueprintEnum,
  DmssAPI,
  Select,
  TreeNode,
} from '@dmt/common'
import { useCallback } from 'react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
// import { CustomScrim } from '../../../../analysis-platform/src/components/CustomScrim'

function sortMenuItems(menuItems: JSX.Element[]) {}

// function useTextInput() {
//   const [value, setValue] = useState<string>('')
//   console.log('val in usetextinput', value)
//   const input = <input onChange={e => setValue(e.target.value)} type={'text'} />
//   return [value, input]
// }

function createMenuItems(
  node: TreeNode,
  dmssAPI: DmssAPI,
  removeNode: Function,
  setShowScrimId: (id: string) => void
): JSX.Element[] {
  let menuItems = []

  // dataSources get a "new root package"
  if (node.type === 'dataSource') {
    menuItems.push(
      <MenuItem key={'new-root-package'} onClick={() => {}}>
        New package
      </MenuItem>
    )
  }

  // Packages get a "new folder"
  if (node.type == BlueprintEnum.PACKAGE) {
    menuItems.push(
      <MenuItem
        key={'new-folder'}
        onClick={() => {
          setShowScrimId('new-folder')
        }}
      >
        New folder
      </MenuItem>
    )
  }

  // Everything besides dataSources and folders can be viewed
  if (!['dataSource', BlueprintEnum.PACKAGE].includes(node.type)) {
    menuItems.push(
      // @ts-ignore
      <MenuItem key={'view'} onClick={() => ViewAction(node)}>
        View in new tab
      </MenuItem>
    )
  }

  // Everything besides dataSources can be deleted
  if (node.type !== 'dataSource') {
    menuItems.push(
      <MenuItem
        key={'delete'}
        onClick={() => {
          setShowScrimId('delete')
        }}
      >
        Delete
      </MenuItem>
    )
  }

  // TODO: Sort (see old api code)
  // return sortMenuItems(menuItems)
  return menuItems
}

const ViewAction = (node: TreeNode) => {
  // @ts-ignore
  window.open(`dmt/view/${node.nodeId}`, '_blank').focus()
}

export const NodeRightClickMenu = (props: {
  node: TreeNode
  removeNode: Function
  children: any
}) => {
  const { node, children, removeNode } = props
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const [showScrimId, setShowScrimId] = useState<string>('')
  const [formData, setFormData] = useState<any>('')

  const menuItems = createMenuItems(node, dmssAPI, removeNode, setShowScrimId)

  const DeleteAction = () => {
    dmssAPI
      .removeByPath(node.pathFromRootPackage(), node.dataSource)
      .then(() => {
        removeNode(node)
        NotificationManager.success('Deleted')
      })
      .catch((error: Error) => {
        console.error(error)
        NotificationManager.error(
          JSON.stringify(error.message),
          'Failed to delete'
        )
      })
  }

  const NewFolderAction = (node: TreeNode, folderName: string) => {
    // dmssAPI.createDocument()
    console.log(node)

    const newFolder = {
      name: folderName,
      type: 'system/SIMOS/Package',
      isRoot: false,
      content: [],
    }
    const ref: string = `${node.nodeId}.content`
    dmssAPI
      .addDocumentToParent({
        absoluteRef: ref,
        body: newFolder,
        updateUncontained: true,
      })
      .then(() => {
        console.log('added package!')
      })
    // setShowScrim(false)
  }

  const NewRootPackageAction = (node: TreeNode, packageName: string) => {
    const newPackage = {
      name: 'test',
      type: 'system/SIMOS/Package',
      isRoot: true,
      content: [],
    }
    const ref: string = node.dataSource
    dmssAPI
      .addDocumentToParent({
        absoluteRef: ref,
        body: newPackage,
        updateUncontained: true,
      })
      .then(() => {
        console.log('added package!')
      })
    // setShowScrim(false)
  }

  return (
    <div>
      <ContextMenuTrigger id={node.nodeId}>{children}</ContextMenuTrigger>
      <ContextMenu id={node.nodeId}>{menuItems}</ContextMenu>
      {showScrimId === 'new-folder' && (
        <div>
          <Scrim isDismissable={true}>
            <Dialog>
              <Dialog.Title>Create new folder</Dialog.Title>
              <Dialog.CustomContent>
                <Label label="Folder name" />
                <Input
                  type={'string'}
                  onChange={event => setFormData(event.target.value)}
                />
                <Button
                  onClick={() => {
                    if (formData) {
                      NewFolderAction(node, formData)
                      setShowScrimId('')
                    } else {
                      NotificationManager.error('Form data cannot be empty!')
                    }
                  }}
                >
                  Create
                </Button>
              </Dialog.CustomContent>
            </Dialog>
          </Scrim>
        </div>
      )}
      {showScrimId === 'delete' && (
        <Scrim isDismissable={true}>
          <Dialog>
            <Dialog.Title>Confirm deletion</Dialog.Title>
            <Dialog.CustomContent>
              Are you sure you want to delete the entity <b>{node.name}</b> of
              type <b>{node.type}</b>?
            </Dialog.CustomContent>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: '5px',
              }}
            >
              <Button onClick={() => setShowScrimId('')}>Cancel</Button>
              <Button
                color="danger"
                onClick={() => {
                  DeleteAction()
                  setShowScrimId('')
                }}
              >
                Delete
              </Button>
            </div>
          </Dialog>
        </Scrim>
      )}
    </div>
  )
}

// trying to set formData in NodeRightClickMenu and then returning it back into the created scrim is not working. have to refactor the whole component to make this work i think....

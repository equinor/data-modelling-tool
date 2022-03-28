import React, { useContext, useState } from 'react'
import { Button, Dialog, Scrim } from '@equinor/eds-core-react'
import './react-contextmenu.css'
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu'
import { AuthContext, BlueprintEnum, DmssAPI, TreeNode } from '@dmt/common'

// @ts-ignore
import { NotificationManager } from 'react-notifications'

function sortMenuItems(menuItems: JSX.Element[]) {}

function createMenuItems(
  node: TreeNode,
  dmssAPI: DmssAPI,
  removeNode: Function,
  setShowScrim: Function,
  setScrimContent: Function
): JSX.Element[] {
  let menuItems = []

  const DeleteAction = (node: TreeNode) => {
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
  const ViewAction = (node: TreeNode) => {
    // @ts-ignore
    window.open(`dmt/view/${node.nodeId}`, '_blank').focus()
  }

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
      <MenuItem key={'new-package'} onClick={() => {}}>
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
          setScrimContent(
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
                <Button onClick={() => setShowScrim(false)}>Cancel</Button>
                <Button color="danger" onClick={() => DeleteAction(node)}>
                  Delete
                </Button>
              </div>
            </Dialog>
          )
          setShowScrim(true)
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

export const NodeRightClickMenu = (props: {
  node: TreeNode
  removeNode: Function
  children: any
}) => {
  const { node, children, removeNode } = props
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const [showScrim, setShowScrim] = useState<boolean>(false)
  const [scrimContent, setScrimContent] = useState<JSX.Element>(<></>)
  const menuItems = createMenuItems(
    node,
    dmssAPI,
    removeNode,
    setShowScrim,
    setScrimContent
  )

  return (
    <div>
      {showScrim && <Scrim isDismissable>{scrimContent}</Scrim>}
      <ContextMenuTrigger id={node.nodeId}>{children}</ContextMenuTrigger>
      <ContextMenu id={node.nodeId}>{menuItems}</ContextMenu>
    </div>
  )
}

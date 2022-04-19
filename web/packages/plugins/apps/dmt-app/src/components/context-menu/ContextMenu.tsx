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

function useTextInput() {
  const [value, setValue] = useState<string>('')
  console.log('val in usetextinput', value)
  const input = <input onChange={e => setValue(e.target.value)} type={'text'} />
  return [value, input]
}

function createMenuItems(
  node: TreeNode,
  dmssAPI: DmssAPI,
  removeNode: Function,
  setShowScrim: Function,
  setShowScrimId: (id: string) => void,
  setScrimContent: Function,
  setFormData: (formData: any) => void,
  formData: any,
  getFormData?: () => string
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
    const [folderName, userInput] = useTextInput()

    const NewFolderAction = (node: TreeNode, folderName: string) => {
      // dmssAPI.createDocument()
      console.log('new folder action with node', node)
      console.log('with name', folderName)
      const newPackage = {
        name: 'test',
        type: 'system/SIMOS/Package',
        contained: true,
      }
      // setShowScrim(false)
    }

    menuItems.push(
      <MenuItem
        key={'new-package'}
        onClick={() => {
          const ref = `${node.nodeId}.content.${node.entity.content.length}`
          // dmssAPI.addDocumentToParent()
          setScrimContent(
            <div>
              {}
              <Typography variant="h5">Create new folder</Typography>
              <Label label="Folder name" />

              <Input
                type={'string'}
                onChange={event => setFormData(event.target.value)}
              />
              {userInput}
              {/*@ts-ignore*/}
              <Button onClick={() => NewFolderAction(node, folderName)}>
                Create
              </Button>
            </div>
          )
          setShowScrim(true)
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
  const [showScrimId, setShowScrimId] = useState<string>('')
  const [formData, setFormData] = useState<any>('fack')
  const [scrimContent, setScrimContent] = useState<JSX.Element>(<></>)
  const getFormData = () => {
    return formData
  }
  const menuItems = createMenuItems(
    node,
    dmssAPI,
    removeNode,
    setShowScrim,
    setShowScrimId,
    setScrimContent,
    setFormData,
    formData,
    getFormData
  )

  useEffect(() => {
    console.log('fromdata', formData)
    console.log('get form data', getFormData())
  }, [formData])

  return (
    <div>
      {showScrim && (
        <div>
          <Scrim isDismissable>{scrimContent}</Scrim>
        </div>
      )}
      <ContextMenuTrigger id={node.nodeId}>{children}</ContextMenuTrigger>
      <ContextMenu id={node.nodeId}>{menuItems}</ContextMenu>
      {/*{showScrimId === 'new-folder' && (*/}
      {/*  <Scrim isDismissable>*/}
      {/*    <div>*/}
      {/*      <Typography variant="h5">Create new folder</Typography>*/}
      {/*      <Label label="Folder name" />*/}
      {/*      <Input*/}
      {/*        type={'string'}*/}
      {/*        onChange={event => setFormData(event.target.value)}*/}
      {/*      />*/}
      {/*      <Button onClick={() => console.log('create ', formData)}>*/}
      {/*        Create*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </Scrim>*/}
      {/*)}*/}
    </div>
  )
}

// trying to set formData in NodeRightClickMenu and then returning it back into the created scrim is not working. have to refactor the whole component to make this work i think....

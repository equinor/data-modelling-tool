import React, { useContext, useState } from 'react'
import { Button, Input, Label } from '@equinor/eds-core-react'
import './react-contextmenu.css'
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu'
import {
  AuthContext,
  BlueprintEnum,
  DmssAPI,
  TreeNode,
  CustomScrim,
} from '@dmt/common'

// @ts-ignore
import { NotificationManager } from 'react-notifications'

function sortMenuItems(menuItems: JSX.Element[]) {}

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
      <MenuItem
        key={'new-root-package'}
        onClick={() => setShowScrimId('new-root-package')}
      >
        New package
      </MenuItem>
    )
  }

  // Packages get a "new folder"
  if (node.type == BlueprintEnum.PACKAGE) {
    menuItems.push(
      <MenuItem key={'new-folder'} onClick={() => setShowScrimId('new-folder')}>
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

//Component that can be used when a context menu action requires one text (string) input.
const SingleTextInput = (props: {
  label: string
  handleSubmit: () => void
  setFormData: (newFormData: string) => void
}) => {
  const { label, handleSubmit, setFormData } = props
  return (
    <div>
      <Label label={label} />
      <Input
        type={'string'}
        onChange={(event) => setFormData(event.target.value)}
      />
      <Button
        style={{ marginTop: '10px' }}
        onClick={() => {
          handleSubmit()
        }}
      >
        Create
      </Button>
    </div>
  )
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
  const [scrimToShow, setScrimToShow] = useState<string>('')
  const [formData, setFormData] = useState<string>('')

  const menuItems = createMenuItems(node, dmssAPI, removeNode, setScrimToShow)

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
      .catch((error: Error) => {
        NotificationManager.error(
          JSON.stringify(error.message),
          'Failed to create new folder'
        )
      })
  }

  const NewRootPackageAction = (node: TreeNode, packageName: string) => {
    const newPackage = {
      name: packageName,
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
      .catch((error: Error) => {
        NotificationManager.error(
          JSON.stringify(error.message),
          'Failed to create new root package'
        )
      })
  }

  const handleFormDataSubmit = (
    node: TreeNode,
    formData: string,
    action: Function
  ) => {
    if (formData) {
      action(node, formData)
      setScrimToShow('')
      setFormData('')
    } else {
      NotificationManager.error('Form data cannot be empty!')
    }
  }

  //TODO when the tree changes by adding new package or deleting something, the tree should be updated to give consistent UI to user
  return (
    <div>
      <ContextMenuTrigger id={node.nodeId}>{children}</ContextMenuTrigger>
      <ContextMenu id={node.nodeId}>{menuItems}</ContextMenu>
      {scrimToShow === 'new-folder' && (
        <div>
          <CustomScrim
            width={'30vw'}
            header={'Create new folder'}
            closeScrim={() => setScrimToShow('')}
          >
            <SingleTextInput
              label={'Folder name'}
              setFormData={setFormData}
              handleSubmit={() =>
                handleFormDataSubmit(node, formData, NewFolderAction)
              }
            />
          </CustomScrim>
        </div>
      )}
      {scrimToShow === 'delete' && (
        <CustomScrim
          width={'30vw'}
          closeScrim={() => setScrimToShow('')}
          header={'Confirm Deletion'}
        >
          <div>
            <div>
              Are you sure you want to delete the entity <b>{node.name}</b> of
              type <b>{node.type}</b>?
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: '5px',
              }}
            >
              <Button onClick={() => setScrimToShow('')}>Cancel</Button>
              <Button
                color="danger"
                onClick={() => {
                  DeleteAction()
                  setScrimToShow('')
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </CustomScrim>
      )}
      {scrimToShow === 'new-root-package' && (
        <CustomScrim
          width={'30vw'}
          closeScrim={() => setScrimToShow('')}
          header={'New root package'}
        >
          <SingleTextInput
            label={'Root package name'}
            handleSubmit={() =>
              handleFormDataSubmit(node, formData, NewRootPackageAction)
            }
            setFormData={setFormData}
          />
        </CustomScrim>
      )}
    </div>
  )
}

import React, { useContext, useState } from 'react'
import { Button, Input, Label, Progress } from '@equinor/eds-core-react'
import './react-contextmenu.css'
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu'
import {
  AuthContext,
  BlueprintEnum,
  DmssAPI,
  TreeNode,
  Dialog,
  BlueprintPicker,
  INPUT_FIELD_WIDTH,
  TAttribute,
} from '@dmt/common'

// @ts-ignore
import { NotificationManager } from 'react-notifications'

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
      // @ts-ignore
      <MenuItem
        key={'new-root-package'}
        onClick={() => setShowScrimId('new-root-package')}
      >
        New package
      </MenuItem>
    )
  }

  // Append to lists
  if (node?.attribute?.dimensions !== '') {
    menuItems.push(
      // @ts-ignore
      <MenuItem
        key={'append-entity'}
        onClick={() => setShowScrimId('append-entity')}
      >
        Append {node.name}
      </MenuItem>
    )
  }

  // Packages get a "new folder"
  // and "new entity"
  // and "new blueprint"
  if (node.type == BlueprintEnum.PACKAGE) {
    menuItems.push(
      // @ts-ignore
      <MenuItem key={'new-entity'} onClick={() => setShowScrimId('new-entity')}>
        New entity
      </MenuItem>
    )
    menuItems.push(
      // @ts-ignore
      <MenuItem
        key={'new-blueprint'}
        onClick={() => setShowScrimId('new-blueprint')}
      >
        New blueprint
      </MenuItem>
    )
    menuItems.push(
      // @ts-ignore
      <MenuItem key={'new-folder'} onClick={() => setShowScrimId('new-folder')}>
        New folder
      </MenuItem>
    )
  }

  // Everything besides dataSources and folders can be viewed
  if (!['dataSource', BlueprintEnum.PACKAGE].includes(node.type)) {
    menuItems.push(
      // @ts-ignore
      <MenuItem
        key={'view'}
        onClick={() => {
          // @ts-ignore
          window.open(`dmt/view/${node.nodeId}`, '_blank').focus()
        }}
      >
        View in new tab
      </MenuItem>
    )
  }

  // Everything besides dataSources can be deleted
  if (node.type !== 'dataSource') {
    menuItems.push(
      //@ts-ignore
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

  return menuItems
}

//Component that can be used when a context menu action requires one text (string) input.
const SingleTextInput = (props: {
  label: string
  handleSubmit: () => void
  setFormData: (newFormData: string) => void
  buttonisDisabled: boolean
}) => {
  const { label, handleSubmit, setFormData, buttonisDisabled } = props
  return (
    <div>
      <div style={{ display: 'block', padding: '10px 0 0 10px' }}>
        <Label label={label} />
        <Input
          type={'string'}
          style={{ width: INPUT_FIELD_WIDTH }}
          onChange={(event) => setFormData(event.target.value)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Button
          disabled={buttonisDisabled}
          style={edsButtonStyleConfig}
          onClick={() => {
            handleSubmit()
          }}
        >
          Create
        </Button>
      </div>
    </div>
  )
}

const edsButtonStyleConfig = {
  marginTop: '40px',
  width: '200px',
  alignSelf: 'center',
}

export const NodeRightClickMenu = (props: {
  node: TreeNode
  removeNode: Function
  children: any
}) => {
  const { node, children, removeNode } = props
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const [scrimToShow, setScrimToShow] = useState<string>('')
  const [formData, setFormData] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)

  const STANDARD_DIALOG_WIDTH = '30vw'
  const STANDARD_DIALOG_HEIGHT = '20vh'

  const menuItems = createMenuItems(node, dmssAPI, removeNode, setScrimToShow)

  const DeleteAction = () => {
    dmssAPI
      .explorerRemoveByPath({
        dataSourceId: node.dataSource,
        removeByPathRequest: {
          directory: node.pathFromRootPackage(),
        },
      })
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
      .explorerAdd({
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
      .explorerAdd({
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
      {/*@ts-ignore*/}
      <ContextMenuTrigger id={node.nodeId}>{children}</ContextMenuTrigger>
      {/*@ts-ignore*/}
      <ContextMenu id={node.nodeId}>{menuItems}</ContextMenu>
      <Dialog
        isOpen={scrimToShow === 'new-folder'}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
        header={'Create new folder'}
        closeScrim={() => {
          setFormData(undefined)
          setScrimToShow('')
        }}
      >
        <SingleTextInput
          label={'Folder name'}
          setFormData={setFormData}
          handleSubmit={() =>
            handleFormDataSubmit(node, formData, NewFolderAction)
          }
          buttonisDisabled={formData === undefined || formData === ''}
        />
      </Dialog>

      <Dialog
        isOpen={scrimToShow === 'delete'}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
        closeScrim={() => setScrimToShow('')}
        header={'Confirm Deletion'}
      >
        <div
          style={{
            padding: '10px',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}
        >
          <div>
            Are you sure you want to delete the entity <b>{node.name}</b> of
            type <b>{node.type}</b>?
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
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
      </Dialog>

      <Dialog
        isOpen={scrimToShow === 'new-root-package'}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
        closeScrim={() => {
          setFormData(undefined)
          setScrimToShow('')
        }}
        header={'New root package'}
      >
        <SingleTextInput
          label={'Root package name'}
          handleSubmit={() =>
            handleFormDataSubmit(node, formData, NewRootPackageAction)
          }
          setFormData={setFormData}
          buttonisDisabled={formData === undefined || formData === ''}
        />
      </Dialog>

      <Dialog
        isOpen={scrimToShow === 'append-entity'}
        closeScrim={() => setScrimToShow('')}
        header={`Append new entity to list`}
        width={STANDARD_DIALOG_WIDTH}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {loading ? (
            <Button style={edsButtonStyleConfig}>
              <Progress.Dots />
            </Button>
          ) : (
            <Button
              style={edsButtonStyleConfig}
              onClick={() => {
                setLoading(true)
                node
                  .addEntity(
                    node?.attribute?.attributeType || '',
                    `${node.entity.length}`
                  )
                  .then(() => {
                    setScrimToShow('')
                  })
                  .catch((error: Error) => {
                    console.error(error)
                    NotificationManager.error('Failed to create entity')
                  })
                  .finally(() => setLoading(false))
              }}
            >
              Create
            </Button>
          )}
        </div>
      </Dialog>

      <Dialog
        isOpen={scrimToShow === 'new-entity'}
        closeScrim={() => setScrimToShow('')}
        header={`Create new entity`}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'block', padding: '10px 0 0 10px' }}>
            <Label label={'Blueprint'} />
            <BlueprintPicker
              onChange={(selectedType: string) =>
                setFormData({ type: selectedType })
              }
              formData={formData?.type || ''}
            />
          </div>
          {loading ? (
            <Button style={edsButtonStyleConfig}>
              <Progress.Dots />
            </Button>
          ) : (
            <Button
              disabled={formData?.type === undefined}
              style={edsButtonStyleConfig}
              onClick={() => {
                setLoading(true)
                node
                  .addEntity(formData?.type, formData?.name || '')
                  .then(() => {
                    setScrimToShow('')
                  })
                  .catch((error: Error) => {
                    console.error(error)
                    NotificationManager.error('Failed to create entity')
                  })
                  .finally(() => setLoading(false))
              }}
            >
              Create
            </Button>
          )}
        </div>
      </Dialog>

      <Dialog
        isOpen={scrimToShow === 'new-blueprint'}
        closeScrim={() => setScrimToShow('')}
        header={`Create new blueprint`}
        width={STANDARD_DIALOG_WIDTH}
        height={STANDARD_DIALOG_HEIGHT}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'block', padding: '10px 0 0 10px' }}>
            <Label label={'Name'} />
            <Input
              style={{ width: INPUT_FIELD_WIDTH }}
              type="string"
              value={formData?.name || ''}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder="Name for new blueprint"
            />
          </div>
          {loading ? (
            <Button style={edsButtonStyleConfig}>
              <Progress.Dots />
            </Button>
          ) : (
            <Button
              disabled={formData?.name === undefined}
              style={edsButtonStyleConfig}
              onClick={() => {
                setLoading(true)
                node
                  .addEntity(BlueprintEnum.BLUEPRINT, formData?.name)
                  .then(() => {
                    setScrimToShow('')
                  })
                  .catch((error: Error) => {
                    console.error(error)
                    NotificationManager.error('Failed to create blueprint')
                  })
                  .finally(() => setLoading(false))
              }}
            >
              Create
            </Button>
          )}
        </div>
      </Dialog>
    </div>
  )
}

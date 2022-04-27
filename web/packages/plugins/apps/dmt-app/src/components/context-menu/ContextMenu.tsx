import React, { useContext, useState } from 'react'
import { Button, Input, Label, Progress } from '@equinor/eds-core-react'
import './react-contextmenu.css'
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu'
import {
  AuthContext,
  BlueprintEnum,
  DmssAPI,
  TreeNode,
  CustomScrim,
  BlueprintPicker,
} from '@dmt/common'

// @ts-ignore
import { NotificationManager } from 'react-notifications'
import styled from 'styled-components'

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
  // and "new entity"
  // and "new blueprint"
  if (node.type == BlueprintEnum.PACKAGE) {
    menuItems.push(
      <MenuItem key={'new-entity'} onClick={() => setShowScrimId('new-entity')}>
        New entity
      </MenuItem>
    )
    menuItems.push(
      <MenuItem
        key={'new-blueprint'}
        onClick={() => setShowScrimId('new-blueprint')}
      >
        New blueprint
      </MenuItem>
    )
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
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const [scrimToShow, setScrimToShow] = useState<string>('')
  const [formData, setFormData] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)

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
      {scrimToShow === 'new-entity' && (
        <div>
          <CustomScrim
            closeScrim={() => setScrimToShow('')}
            header={`Create new entity`}
            width={'30vw'}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'block' }}>
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
          </CustomScrim>
        </div>
      )}
      {scrimToShow === 'new-blueprint' && (
        <div>
          <CustomScrim
            closeScrim={() => setScrimToShow('')}
            header={`Create new blueprint`}
            width={'30vw'}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'block' }}>
                <Label label={'Name'} />
                <Input
                  style={{ width: '360px', margin: '0 8px' }}
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
                  disabled={formData?.type === undefined}
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
          </CustomScrim>
        </div>
      )}
    </div>
  )
}

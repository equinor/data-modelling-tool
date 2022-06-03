import React, { useContext, useEffect, useState } from 'react'
import { Button, Input, Label } from '@equinor/eds-core-react'
import { Dialog } from './Dialog'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import {
  BlueprintPicker,
  DestinationPicker,
  EntityPickerButton,
} from './Pickers'
import { addToPath } from './UploadFileButton'
import { AuthContext, DmssAPI, DmtAPI, INPUT_FIELD_WIDTH, TReference } from '..'
import { AxiosError } from 'axios'

export function NewEntityButton(props: {
  type?: string
  setReference: (r: TReference) => void
}) {
  const { type, setReference } = props
  const [showScrim, setShowScrim] = useState<boolean>(false)
  const [saveDestination, setSaveDestination] = useState<string>('')
  const [newName, setNewName] = useState<string>('')
  const [copyTarget, setCopyTarget] = useState<TReference | undefined>(
    undefined
  )
  const [typeToCreate, setTypeToCreate] = useState<string>(type || '')
  const { token } = useContext(AuthContext)
  const dmtAPI = new DmtAPI(token)

  useEffect(() => setTypeToCreate(type || ''), [type])

  function addEntityToPath(entity: any): Promise<void> {
    const [dataSource, ...directories] = saveDestination.split('/')
    const directory = directories.join('/')
    return addToPath(entity, token, [], dataSource, directory)
      .then((newId: string) =>
        setReference({ _id: newId, type: entity.type, name: entity.name })
      )
      .catch((error: AxiosError) => {
        console.error(error)
        NotificationManager.error(
          // @ts-ignore
          JSON.stringify(error?.response?.data?.message || error.message),
          'Failed to create'
        )
      })
  }

  return (
    <div style={{ margin: '0 10px' }}>
      <Button onClick={() => setShowScrim(true)}>New</Button>
      <Dialog
        isOpen={showScrim}
        closeScrim={() => setShowScrim(false)}
        header={`Create new entity`}
        width={'600px'}
        height={'370px'}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            margin: '20px',
            minHeight: '270px',
          }}
        >
          <Label label={'Folder'} />
          <DestinationPicker
            onChange={(value: any) => setSaveDestination(value)}
            formData={saveDestination}
          />
          <div style={{ display: 'block' }}>
            <Label label={'Blueprint'} />
            <BlueprintPicker
              disabled={!!copyTarget}
              onChange={(selectedType: string) => setTypeToCreate(selectedType)}
              formData={typeToCreate}
            />
            {!!copyTarget && (
              <div
                style={{ marginLeft: '40px' }}
              >{`Copying entity named '${copyTarget.name}'`}</div>
            )}
          </div>
          <Label label={'Name'} />
          <Input
            style={{
              width: INPUT_FIELD_WIDTH,
              cursor: 'text',
            }}
            type="string"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Name for new entity"
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: '40px',
            }}
          >
            {!copyTarget ? (
              <EntityPickerButton
                variant="outlined"
                text="Copy existing"
                onChange={(ref: TReference) => setCopyTarget(ref)}
              />
            ) : (
              <Button
                onClick={() => setCopyTarget(undefined)}
                variant="outlined"
                color="danger"
              >
                Don't copy
              </Button>
            )}
            <Button
              disabled={
                !(newName && saveDestination && (typeToCreate || copyTarget))
              }
              type="submit"
              onClick={() => {
                if (copyTarget) {
                  // @ts-ignore
                  delete copyTarget._id
                  copyTarget.name = newName
                  addEntityToPath({ ...copyTarget }).then(() =>
                    setShowScrim(false)
                  )
                } else {
                  dmtAPI
                    .createEntity(typeToCreate, newName)
                    .then((newEntity: any) => {
                      addEntityToPath({ ...newEntity }).then(() =>
                        setShowScrim(false)
                      )
                    })
                }
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

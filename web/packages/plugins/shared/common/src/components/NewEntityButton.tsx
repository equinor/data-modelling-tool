import React, { useContext, useEffect, useState } from 'react'
import { Button, Input, Label } from '@equinor/eds-core-react'
import { CustomScrim } from './Modal/CustomScrim'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintPicker, DestinationPicker } from './Pickers'
import { addToPath } from './UploadFileButton'
import { AuthContext, DmtAPI, INPUT_FIELD_WIDTH, TReference } from '..'

export function NewEntityButton(props: {
  type: string
  setReference: (r: TReference) => void
}) {
  const { type, setReference } = props
  const [showScrim, setShowScrim] = useState<boolean>(false)
  const [saveDestination, setSaveDestination] = useState<string>('')
  const [newName, setNewName] = useState<string>('')
  const [typeToCreate, setTypeToCreate] = useState<string>(type)
  // @ts-ignore
  const { token } = useContext(AuthContext)
  const dmtAPI = new DmtAPI(token)

  useEffect(() => setTypeToCreate(type), [type])

  function addEntityToPath(entity: any): Promise<void> {
    const [dataSource, ...directories] = saveDestination.split('/')
    const directory = directories.join('/')
    return addToPath(entity, token, [], dataSource, directory)
      .then((newId: string) =>
        setReference({ _id: newId, type: entity.type, name: entity.name })
      )
      .catch((error: any) => {
        console.error(error)
        NotificationManager.error(JSON.stringify(error), 'Failed to create')
      })
  }

  return (
    <div style={{ margin: '0 10px' }}>
      <Button onClick={() => setShowScrim(true)}>New</Button>
      <CustomScrim
        isOpen={showScrim}
        closeScrim={() => setShowScrim(false)}
        header={`Create new entity`}
        width={'50vw'}
        height={'40vh'}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <Label label={typeToCreate} />
          <DestinationPicker
            onChange={(value: any) => {
              setSaveDestination(value)
            }}
            formData={saveDestination}
          />
          <div style={{ display: 'block' }}>
            <Label label={'Blueprint'} />
            <BlueprintPicker
              onChange={(selectedType: string) => setTypeToCreate(selectedType)}
              formData={type}
            />
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
          <Button
            style={{
              marginTop: '40px',
              alignSelf: 'center',
            }}
            onClick={() => {
              dmtAPI
                .createEntity(typeToCreate, newName)
                .then((newEntity: any) => {
                  addEntityToPath({ ...newEntity }).then(() =>
                    setShowScrim(false)
                  )
                })
            }}
          >
            Create
          </Button>
        </div>
      </CustomScrim>
    </div>
  )
}

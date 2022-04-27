import React, { useContext, useState, useEffect } from 'react'
import { Button, Input, Label } from '@equinor/eds-core-react'
import { CustomScrim } from './Modal/CustomScrim'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintPicker, DestinationPicker } from './Pickers'
import { addToPath } from './UploadFileButton'
import { AuthContext, DmtAPI, TReference } from '..'

export function NewEntityButton(props: {
  type: string
  setReference: (r: TReference) => void
}) {
  const { type, setReference } = props
  const dmtAPI = new DmtAPI()
  const [showScrim, setShowScrim] = useState<boolean>(false)
  const [saveDestination, setSaveDestination] = useState<string>('')
  const [newName, setNewName] = useState<string>('')
  const [typeToCreate, setTypeToCreate] = useState<string>(type)
  // @ts-ignore
  const { token } = useContext(AuthContext)

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
        width={'500px'}
        height={'400px'}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Label label={'Folder for new entity'} />
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
            style={{ width: '360px', margin: '0 8px', cursor: 'pointer' }}
            type="string"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Name for new entity"
          />
          <Button
            style={{ marginTop: '40px', width: '200px', alignSelf: 'center' }}
            onClick={() => {
              dmtAPI
                .createEntity(typeToCreate, token)
                .then((newEntity: any) => {
                  addEntityToPath({ ...newEntity, name: newName }).then(() =>
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

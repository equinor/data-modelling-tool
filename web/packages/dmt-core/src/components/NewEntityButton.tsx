import React, { useContext, useEffect, useState } from 'react'
import { Button, Input, Label, Progress } from '@equinor/eds-core-react'
import { Dialog } from './Dialog'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import {
  BlueprintPicker,
  DestinationPicker,
  EntityPickerButton,
} from './Pickers'
import { addToPath } from './UploadFileButton'
import { AxiosError } from 'axios'
import styled from 'styled-components'
import { AuthContext } from 'react-oauth2-code-pkce'
import { TReference } from '../types'
import { INPUT_FIELD_WIDTH } from '../utils/variables'
import { DmtAPI } from '../services'

const DialogWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justifycontent: space-between;
  margin: 20px;
  & > * {
    padding-top: 8px;
  }
`

export function NewEntityButton(props: {
  type?: string
  setReference: (r: TReference) => void
  defaultDestination?: string
}) {
  const { type, setReference, defaultDestination } = props
  const [showScrim, setShowScrim] = useState<boolean>(false)
  const [saveDestination, setSaveDestination] = useState<string>(
    defaultDestination ? defaultDestination : ''
  )

  const [newName, setNewName] = useState<string>('')
  const [copyTarget, setCopyTarget] = useState<TReference | undefined>(
    undefined
  )
  const [typeToCreate, setTypeToCreate] = useState<string>(type || '')
  const [loading, setLoading] = useState<boolean>(false)
  const { token } = useContext(AuthContext)
  const dmtAPI = new DmtAPI(token)

  useEffect(() => setTypeToCreate(type || ''), [type])
  useEffect(() => {
    if (defaultDestination) {
      setSaveDestination(defaultDestination)
    }
  }, [defaultDestination])

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
        <DialogWrapper>
          {!type && (
            <div style={{ display: 'block' }}>
              <BlueprintPicker
                label={'Blueprint'}
                disabled={!!copyTarget}
                onChange={(selectedType: string) =>
                  setTypeToCreate(selectedType)
                }
                formData={typeToCreate}
              />
            </div>
          )}

          {!defaultDestination && (
            <div>
              <DestinationPicker
                label={'Entity destination folder'}
                onChange={(selectedFolder: string) =>
                  setSaveDestination(selectedFolder)
                }
                formData={saveDestination}
              />
            </div>
          )}
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
          {!!copyTarget && (
            <div>{`Copying entity named '${copyTarget.name}'`}</div>
          )}
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
                typeFilter={typeToCreate}
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
                setLoading(true)

                if (copyTarget) {
                  // @ts-ignore
                  delete copyTarget._id
                  copyTarget.name = newName

                  addEntityToPath({ ...copyTarget })
                    .then(() => setShowScrim(false))
                    .finally(() => {
                      setCopyTarget(undefined)
                      setNewName('')
                      setLoading(false)
                    })
                } else {
                  dmtAPI
                    .instantiateEntity({
                      basicEntity: {
                        name: newName as string,
                        type: typeToCreate,
                      },
                    })
                    .then((newEntity) => {
                      addEntityToPath({ ...newEntity.data }).then(() =>
                        setShowScrim(false)
                      )
                    })
                    .finally(() => {
                      setLoading(false)
                      setCopyTarget(undefined)
                      setNewName('')
                    })
                }
              }}
            >
              {loading ? <Progress.Dots /> : 'Create'}
            </Button>
          </div>
        </DialogWrapper>
      </Dialog>
    </div>
  )
}

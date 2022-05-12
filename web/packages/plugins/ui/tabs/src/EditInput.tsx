import {
  BlueprintPicker,
  DmtUIPlugin,
  JobHandlerPicker,
  TReference,
  UIPluginSelector,
  useDocument,
  NewEntityButton,
  EntityPickerButton,
  INPUT_FIELD_WIDTH,
} from '@dmt/common'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Button, Input, Label, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { useTabContext } from './TabsContext'

const Column = styled.div``

const GroupWrapper = styled.div`
  & > * {
    padding-top: 8px;
  }
`

const HeaderWrapper = styled.div`
  margin-bottom: 50px;
  margin-top: 8px;
`

export const EditInput = (props: DmtUIPlugin) => {
  const {
    document,
    documentId,
    dataSourceId,
    onSubmit,
    onChange,
    categories,
  } = props

  const { onOpen } = useTabContext()

  const [_document, _loading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId,
    false
  )
  const [formData, setFormData] = useState<any>({ ...document })

  useEffect(() => {
    if (!_document) return
    // onChange is an indicator if the plugin is used within another plugin. If so, don't override formData
    if (!onChange) {
      // @ts-ignore
      setFormData({ ..._document })
    }
  }, [_document])

  useEffect(() => {
    if (onChange) onChange(formData)
  }, [formData])

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <HeaderWrapper>
          <Typography variant="h3">Input</Typography>
          <GroupWrapper>
            <Column>
              <Label label={'Blueprint'} />
              <BlueprintPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, inputType: selectedBlueprint })
                }
                formData={formData.inputType || ''}
              />
            </Column>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <Column>
                <Label label={'Input entity'} />
                <Input
                  style={{ cursor: 'pointer', width: INPUT_FIELD_WIDTH }}
                  type="string"
                  value={formData?.input?.name || formData?.input?._id || ''}
                  placeholder={formData?.input?.name || 'Select or create'}
                  onChange={() => {}}
                  onClick={() => {
                    onOpen({
                      attribute: 'input',
                      onChange: (appInput: any) =>
                        setFormData({
                          ...formData,
                          input: appInput,
                        }),
                      entity: formData.input,
                      absoluteDottedId: `${dataSourceId}/${formData.input._id}`,
                      // categories: ['container'],
                    })
                  }}
                />
              </Column>
              <EntityPickerButton
                typeFilter={formData.inputType}
                onChange={(selectedEntity: TReference) =>
                  setFormData({
                    ...formData,
                    input: selectedEntity,
                  })
                }
              />
              <NewEntityButton
                type={formData.inputType}
                setReference={(createdEntity: TReference) =>
                  setFormData({
                    ...formData,
                    input: createdEntity,
                  })
                }
              />
            </div>
          </GroupWrapper>
        </HeaderWrapper>

        {onChange === undefined && (
          <div style={{ justifyContent: 'space-around', display: 'flex' }}>
            <Button
              as="button"
              variant="outlined"
              color="danger"
              onClick={() => setFormData({ ...document })}
            >
              Reset
            </Button>
            <Button
              as="button"
              onClick={() => {
                if (onSubmit) {
                  onSubmit(formData)
                } else {
                  updateDocument(formData, true)
                }
              }}
            >
              Ok
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

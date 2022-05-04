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

export const EditTask = (props: DmtUIPlugin) => {
  const {
    document,
    documentId,
    dataSourceId,
    onSubmit,
    onOpen,
    onChange,
    categories,
  } = props
  const [_document, _loading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId,
    false
  )
  const [formData, setFormData] = useState<any>({ ...document })
  const defaultRunnerType = 'WorkflowDS/Blueprints/jobHandlers/AzureContainer'

  useEffect(() => {
    if (!_document) return
    // onChange is an indicator if the plugin is used within another plugin. If so, don't override formData
    if (!onChange) setFormData({ ..._document })
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
                formData={formData.inputType}
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
                  value={
                    formData?.applicationInput?.name ||
                    formData?.applicationInput?._id ||
                    ''
                  }
                  placeholder={
                    formData?.applicationInput?.name || 'Select or create'
                  }
                  onChange={() => {}}
                  onClick={() => {
                    if (!formData?.applicationInput) return
                    onOpen({
                      attribute: 'applicationInput',
                      onChange: (appInput: any) =>
                        setFormData({
                          ...formData,
                          applicationInput: appInput,
                        }),
                      entity: formData.applicationInput,
                      absoluteDottedId: `${dataSourceId}/${formData.applicationInput._id}`,
                      // Child entities should use plugins with this category tag, if they have any
                      categories: ['container'],
                    })
                  }}
                />
              </Column>
              <EntityPickerButton
                typeFilter={formData.inputType}
                onChange={(selectedEntity: any) => {
                  setFormData({
                    ...formData,
                    applicationInput: selectedEntity,
                  })
                }}
              />
              <NewEntityButton
                type={formData.inputType}
                setReference={(createdEntity: TReference) =>
                  setFormData({
                    ...formData,
                    applicationInput: createdEntity,
                  })
                }
              />
            </div>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Output</Typography>
          <GroupWrapper>
            <Column>
              <Label label={'Blueprint'} />
              <BlueprintPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, outputType: selectedBlueprint })
                }
                formData={formData.outputType}
              />
            </Column>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Job runner</Typography>
          <GroupWrapper>
            <Column>
              <Label label={'Blueprint'} />
              <JobHandlerPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({
                    ...formData,
                    runner: { ...formData?.runner, type: selectedBlueprint },
                  })
                }
                formData={formData?.runner?.type || defaultRunnerType}
              />
              <div
                style={{
                  margin: '10px 20px',
                  borderLeft: '2px solid grey',
                  paddingLeft: '10px',
                }}
              >
                {onOpen ? (
                  <Button
                    onClick={() =>
                      onOpen({
                        attribute: 'runner',
                        entity: formData?.runner || {
                          type: defaultRunnerType,
                        },
                        absoluteDottedId: `${dataSourceId}/${documentId}.runner`,
                        onSubmit: (data: any) =>
                          setFormData({ ...formData, runner: data }),
                      })
                    }
                  >
                    Open
                  </Button>
                ) : (
                  <UIPluginSelector
                    absoluteDottedId={`${dataSourceId}/${documentId}.runner`}
                    entity={formData?.runner || { type: defaultRunnerType }}
                    breadcrumb={false}
                    categories={categories}
                    onChange={(data: any) =>
                      setFormData({ ...formData, runner: data })
                    }
                    onSubmit={(data: any) =>
                      setFormData({ ...formData, runner: data })
                    }
                  />
                )}
              </div>
            </Column>
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

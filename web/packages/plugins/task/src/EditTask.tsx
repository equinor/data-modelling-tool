import {
  BlueprintPicker,
  IDmtUIPlugin,
  JobHandlerPicker,
  TReference,
  UIPluginSelector,
  useDocument,
  NewEntityButton,
  EntityPickerButton,
  INPUT_FIELD_WIDTH,
  Loading,
  DestinationPicker,
  TTaskFormData,
  TRunner,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  Button,
  Input,
  Label,
  Progress,
  Typography,
} from '@equinor/eds-core-react'
import styled from 'styled-components'
import _ from 'lodash'
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

export const EditTask = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId, onOpen, onSubmit } = props
  const [document, loading, updateDocument] = useDocument<TTaskFormData>(
    dataSourceId,
    documentId,
    999
  )

  const [formData, setFormData] = useState<TTaskFormData | undefined>(undefined)
  const [entityDestination, setEntityDestination] = useState<string>('')
  const runnerTypeHasChanged =
    formData?.runner?.type && formData?.runner?.type === document?.runner?.type
  useEffect(() => {
    if (!document) return
    // onChange is an indicator if the plugin is used within another plugin. If so, don't override formData
    setFormData({ ...document })
  }, [document])

  if (loading || formData === undefined) {
    return <Loading />
  }

  return (
    <div>
      <div style={{ marginBottom: '0px' }}>
        <HeaderWrapper>
          <Typography variant="h3">Input</Typography>
          <GroupWrapper>
            <Column>
              <BlueprintPicker
                label={'Blueprint'}
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, inputType: selectedBlueprint })
                }
                formData={formData.inputType || ''}
              />
            </Column>
            <Column>
              <DestinationPicker
                label={'Entity destination folder'}
                onChange={(selectedFolder: string) =>
                  setEntityDestination(selectedFolder)
                }
                formData={entityDestination}
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
                    formData.applicationInput?.name ||
                    formData.applicationInput?._id ||
                    ''
                  }
                  placeholder={
                    formData.applicationInput?.name || 'Select or create'
                  }
                  onClick={() => {
                    if (!Object.keys(formData.applicationInput || {}).length)
                      return
                    if (onOpen)
                      onOpen({
                        attribute: 'applicationInput',
                        entity: formData.applicationInput,
                        absoluteDottedId: `${dataSourceId}/${formData.applicationInput?._id}`,
                        // Child entities should use plugins with this category tag, if they have any
                        categories: ['container'],
                        config: { subCategories: ['edit'] },
                      })
                  }}
                />
              </Column>
              <EntityPickerButton
                typeFilter={formData.inputType}
                onChange={(selectedEntity) => {
                  setFormData({
                    ...formData,
                    applicationInput: selectedEntity,
                  })
                }}
              />
              <NewEntityButton
                type={formData.inputType}
                defaultDestination={entityDestination}
                setReference={(createdEntity: TReference) => {
                  setFormData({
                    ...formData,
                    applicationInput: createdEntity,
                  })
                }}
              />
            </div>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Output</Typography>
          <GroupWrapper>
            <Column>
              <BlueprintPicker
                label={'Blueprint'}
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, outputType: selectedBlueprint })
                }
                formData={formData.outputType || ''}
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
                onChange={(selectedBlueprint: string) => {
                  setFormData({
                    ...formData,
                    runner: { type: selectedBlueprint },
                  })
                }}
                formData={formData.runner?.type || ''}
              />
              {formData.runner?.type && (
                <div
                  style={{
                    margin: '10px 20px',
                    borderLeft: '2px solid grey',
                    paddingLeft: '10px',
                  }}
                >
                  {runnerTypeHasChanged ? (
                    <p></p>
                  ) : (
                    <p>Please save the analysis before opening job runner</p>
                  )}
                  {onOpen ? (
                    <Button
                      disabled={!runnerTypeHasChanged}
                      onClick={() =>
                        onOpen({
                          attribute: 'runner',
                          categories: ['edit'],
                          entity: formData.runner,
                          absoluteDottedId: `${dataSourceId}/${documentId}.runner`,
                          onSubmit: (data: TRunner) => {
                            setFormData({ ...formData, runner: data })
                          },
                        })
                      }
                    >
                      Open
                    </Button>
                  ) : (
                    <UIPluginSelector
                      absoluteDottedId={`${dataSourceId}/${documentId}.runner`}
                      type={formData.runner.type}
                      breadcrumb={false}
                      categories={['edit']}
                    />
                  )}
                </div>
              )}
            </Column>
          </GroupWrapper>
        </HeaderWrapper>

        <div style={{ justifyContent: 'space-around', display: 'flex' }}>
          <Button
            as="button"
            variant="outlined"
            color="danger"
            onClick={() => setFormData({ ...document })}
          >
            Reset
          </Button>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {loading ? (
              <Button>
                <Progress.Dots />
              </Button>
            ) : (
              <Button
                as="button"
                onClick={() => {
                  updateDocument(formData, true)
                  if (onSubmit) {
                    onSubmit(formData)
                  }
                }}
              >
                {!_.isEqual(document, formData) ? 'Save *' : 'Save'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

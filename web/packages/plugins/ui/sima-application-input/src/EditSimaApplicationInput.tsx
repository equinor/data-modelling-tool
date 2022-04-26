import {
  BlueprintPicker,
  DestinationPicker,
  DmtUIPlugin,
  EntityPickerButton,
  EntityPickerInput,
  PATH_INPUT_FIELD_WIDTH,
  NewEntityButton,
  TReference,
  UploadFileButton,
  INPUT_FIELD_WIDTH,
} from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'
import { Input, Label, TextField, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { EditColumn } from '../../task/src/UiPluginStyledComponents'

const STaskBlueprint = 'AnalysisPlatformDS/Blueprints/STask'

const Wrapper = styled.div`
  margin: 10px;
`

const Row = styled.div`
  display: flex;
`
const GroupWrapper = styled.div`
  & > * {
    padding-top: 8px;
  }
`

const HeaderWrapper = styled.div`
  margin-bottom: 50px;
  margin-top: 8px;
`

export const EditSimaApplicationInput = (props: DmtUIPlugin) => {
  const { document, dataSourceId, onChange, onOpen } = props
  const [formData, setFormData] = useState<any>({ ...document })

  useEffect(() => {
    if (onChange) onChange(formData)
  }, [formData])

  function getNewSTaskBody(filename: string): any {
    return {
      type: 'AnalysisPlatformDS/Blueprints/STask',
      name: filename.replace('.', '_'),
      blob: {
        name: filename,
        type: 'system/SIMOS/Blob',
      },
    }
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
    >
      <div style={{ marginBottom: '10px' }}>
        <HeaderWrapper>
          <Typography variant="h3">Input</Typography>
          <GroupWrapper>
            <EditColumn>
              <Label label={'Blueprint'} />
              <BlueprintPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, inputType: selectedBlueprint })
                }
                formData={formData?.inputType || ''}
              />
            </EditColumn>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <EditColumn>
                <Label label={'Input entity'} />
                <Input
                  style={{ cursor: 'pointer', width: INPUT_FIELD_WIDTH }}
                  type="string"
                  value={formData?.input?.name || formData?.input?._id || ''}
                  placeholder={formData?.input?.name || 'Select or create'}
                  onChange={() => {}}
                  onClick={() => {
                    if (formData?.input?.type) {
                      onOpen({
                        attribute: 'input',
                        entity: formData.input,
                        onChange: (input: any) =>
                          setFormData({ ...formData, input: input }),
                        absoluteDottedId: `${dataSourceId}/${formData?.input?._id}`,
                        categories: [],
                      })
                    }
                  }}
                />
              </EditColumn>
              <EntityPickerButton
                typeFilter={formData?.inputType || ''}
                onChange={(selectedEntity: TReference) =>
                  setFormData({
                    ...formData,
                    input: selectedEntity,
                  })
                }
              />
              <NewEntityButton
                type={formData?.inputType || ''}
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

        <HeaderWrapper>
          <Typography variant="h3">Output</Typography>
          <GroupWrapper>
            <EditColumn>
              <Label label={'Blueprint'} />
              <BlueprintPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, outputType: selectedBlueprint })
                }
                formData={formData.outputType}
              />
            </EditColumn>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">SIMA Task</Typography>
          <GroupWrapper>
            <EditColumn>
              <Label label={'Select Stask'} />
              <Row>
                <EntityPickerInput
                  formData={formData.stask}
                  typeFilter={STaskBlueprint}
                  onChange={(selectedStask: any) =>
                    setFormData({
                      ...formData,
                      stask: selectedStask,
                    })
                  }
                />
                <UploadFileButton
                  fileSuffix={['stask']}
                  dataSourceId={dataSourceId}
                  getBody={(filename: string) => getNewSTaskBody(filename)}
                  onUpload={(createdRef: TReference) =>
                    setFormData({
                      ...formData,
                      stask: createdRef,
                    })
                  }
                />
              </Row>
            </EditColumn>
            <TextField
              id="workflow"
              label={'Workflow'}
              value={formData?.workflow || ''}
              placeholder="Name of workflow to run"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, workflow: event.target.value })
              }
              style={{ width: INPUT_FIELD_WIDTH }}
            />
            <TextField
              id="workflowTask"
              label={'Workflow task'}
              value={formData?.workflowTask || ''}
              placeholder="Name of workflowTask to run"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, workflowTask: event.target.value })
              }
              style={{ width: INPUT_FIELD_WIDTH }}
            />
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Result </Typography>
          <GroupWrapper>
            <EditColumn>
              <Label label={'Folder'} />
              <DestinationPicker
                formData={formData?.resultPath || ''}
                onChange={(selectedFolder: string) =>
                  setFormData({
                    ...formData,
                    resultPath: selectedFolder,
                  })
                }
              />
            </EditColumn>
          </GroupWrapper>
        </HeaderWrapper>
      </div>
    </div>
  )
}

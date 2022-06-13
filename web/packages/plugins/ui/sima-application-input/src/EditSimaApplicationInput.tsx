import {
  BlueprintPicker,
  DestinationPicker,
  DmtUIPlugin,
  EntityPickerButton,
  EntityPickerInput,
  INPUT_FIELD_WIDTH,
  NewEntityButton,
  TReference,
  UploadFileButton,
  useDocument,
} from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  Input,
  Label,
  TextField,
  Typography,
  Tooltip,
  Button,
  Progress,
} from '@equinor/eds-core-react'
import styled from 'styled-components'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

const STaskBlueprint = 'AnalysisPlatformDS/Blueprints/STask'

const Column = styled.div``

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
  const { document, dataSourceId, onOpen, documentId } = props
  const [formData, setFormData] = useState<any>({ ...document })
  const [_document, loading, updateDocument] = useDocument(
    dataSourceId,
    documentId
  )

  useEffect(() => {
    if (!_document) return
    setFormData(_document)
  }, [_document])

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
      style={{
        display: 'flex',
        alignItems: 'left',
        flexDirection: 'column',
        margin: '10px 20px',
      }}
    >
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
                formData={formData?.inputType || ''}
              />
            </Column>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Column>
                <Label label={'Input entity'} />
                <Input
                  style={{ cursor: 'pointer', width: INPUT_FIELD_WIDTH }}
                  type="string"
                  value={formData?.input?.name || formData?.input?._id || ''}
                  placeholder={formData?.input?.name || 'Select or create'}
                  onChange={() => {}}
                  onClick={() => {
                    if (formData?.input?.type) {
                      if (onOpen)
                        onOpen({
                          attribute: 'input',
                          entity: formData.input,
                          onChange: (input: any) =>
                            setFormData({ ...formData, input: input }),
                          absoluteDottedId: `${dataSourceId}/${formData?.input?._id}`,
                          categories: ['edit'],
                        })
                    }
                  }}
                />
              </Column>
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
            <Column>
              <Label label={'Blueprint'} />
              <BlueprintPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, outputType: selectedBlueprint })
                }
                formData={formData?.outputType || ''}
              />
            </Column>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">SIMA Task</Typography>
          <GroupWrapper>
            <Column>
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
                  formData={formData.stask}
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
            </Column>
            <TextField
              id="workflow"
              label={'Workflow'}
              value={formData?.workflow || ''}
              placeholder="Name of workflow to run"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  workflow: event.target.value,
                })
              }
              style={{ width: INPUT_FIELD_WIDTH }}
            />
            <TextField
              id="workflowTask"
              label={'Workflow task'}
              value={formData?.workflowTask || ''}
              placeholder="Name of workflowTask to run"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  workflowTask: event.target.value,
                })
              }
              style={{ width: INPUT_FIELD_WIDTH }}
            />
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Input/Output Paths</Typography>
          <GroupWrapper>
            <Tooltip
              enterDelay={300}
              title={
                "Which file the STask is configured to read it's input from."
              }
              placement="right"
            >
              <TextField
                id="inputPath"
                label={'Input path'}
                value={formData?.simaInputFilePath || ''}
                placeholder="The simulations input file"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    simaInputFilePath: event.target.value,
                  })
                }
                style={{ width: INPUT_FIELD_WIDTH }}
              />
            </Tooltip>
            <Tooltip
              enterDelay={300}
              title={'Which file SIMA will write the result into'}
              placement="right"
            >
              <TextField
                id="outputPath"
                label={'Output path'}
                value={formData?.simaOutputFilePath || ''}
                placeholder="The simulations output file"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    simaOutputFilePath: event.target.value,
                  })
                }
                style={{ width: INPUT_FIELD_WIDTH }}
              />
            </Tooltip>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Result </Typography>
          <GroupWrapper>
            <Column>
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
          {loading ? (
            <Button>
              <Progress.Dots />
            </Button>
          ) : (
            <Button as="button" onClick={() => updateDocument(formData, true)}>
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

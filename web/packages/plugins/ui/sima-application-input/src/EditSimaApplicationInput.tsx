import {
  BlueprintPicker,
  DestinationPicker,
  DmtUIPlugin,
  EntityPickerInput,
  INPUT_FIELD_WIDTH,
  Loading,
  TReference,
  UploadFileButton,
  useDocument,
} from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  Button,
  Label,
  Progress,
  TextField,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import {
  Column,
  EditInputEntity,
  GroupWrapper,
  HeaderWrapper,
  Row,
} from './components'

const STaskBlueprint = 'AnalysisPlatformDS/Blueprints/STask'

export const EditSimaApplicationInput = (props: DmtUIPlugin) => {
  const { dataSourceId, onOpen, documentId } = props
  const [formData, setFormData] = useState<any>(null)
  const [document, loading, updateDocument] = useDocument(
    dataSourceId,
    documentId
  )

  useEffect(() => {
    if (!document) return
    setFormData(document)
  }, [document])

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

  if (loading) return <Loading />
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
            <EditInputEntity
              formData={formData}
              setFormData={setFormData}
              dataSourceId={dataSourceId}
              onOpen={onOpen}
            />
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

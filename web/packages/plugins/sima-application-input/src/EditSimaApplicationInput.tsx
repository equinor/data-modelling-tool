import {
  BlueprintPicker,
  DestinationPicker,
  IDmtUIPlugin,
  EntityPickerInput,
  INPUT_FIELD_WIDTH,
  Loading,
  PATH_INPUT_FIELD_WIDTH,
  TReference,
  truncatePathString,
  TSTaskBody,
  UploadFileButton,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  Button,
  Progress,
  TextField,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'

import {
  Column,
  Container,
  EditInputEntity,
  GroupWrapper,
  HeaderWrapper,
  Row,
} from './components'
import _ from 'lodash'
import { TSIMAApplicationInput } from './Types'

const ReadOnlyPathTextField = (props: { path: string; label: string }) => {
  return (
    <Tooltip
      title={truncatePathString(props.path) === props.path ? '' : props.path}
    >
      <TextField
        id={props.label}
        style={{
          width: PATH_INPUT_FIELD_WIDTH,
        }}
        type="string"
        label={props.label || ''}
        value={truncatePathString(props.path)}
      />
    </Tooltip>
  )
}

const ReadOnlyTextField = (props: { text: string; label: string }) => {
  return (
    <TextField
      id={props.label}
      label={props.label}
      value={props.text}
      style={{ width: INPUT_FIELD_WIDTH }}
    />
  )
}

const STaskBlueprint = 'AnalysisPlatformDS/Blueprints/STask'

export const EditSimaApplicationInput = (props: IDmtUIPlugin) => {
  const { dataSourceId, onOpen, documentId, readOnly } = props
  const [formData, setFormData] = useState<TSIMAApplicationInput | null>(null)
  const [
    document,
    loading,
    updateDocument,
  ] = useDocument<TSIMAApplicationInput>(dataSourceId, documentId)

  useEffect(() => {
    if (!document) return
    setFormData(document)
  }, [document])

  function getNewSTaskBody(filename: string): TSTaskBody {
    return {
      type: 'AnalysisPlatformDS/Blueprints/STask',
      name: filename.replace('.', '_'),
      blob: {
        name: filename,
        type: 'system/SIMOS/Blob',
      },
    }
  }

  if (loading || formData === null) return <Loading />
  return (
    <Container>
      <div style={{ marginBottom: '10px' }}>
        <HeaderWrapper>
          <Typography variant="h3">Input</Typography>
          <GroupWrapper>
            <Column>
              {readOnly ? (
                <ReadOnlyPathTextField
                  label={'Blueprint'}
                  path={formData.inputType || 'None'}
                />
              ) : (
                <BlueprintPicker
                  onChange={(selectedBlueprint: string) =>
                    setFormData({ ...formData, inputType: selectedBlueprint })
                  }
                  formData={formData.inputType || ''}
                />
              )}
            </Column>
            {readOnly ? (
              <ReadOnlyTextField
                text={formData.input?.name || formData.input?._id || 'None'}
                label={'Input entity'}
              />
            ) : (
              <>
                <DestinationPicker
                  label={'Folder presented for input selection'}
                  onChange={(presetFolder: string) =>
                    setFormData({
                      ...formData,
                      inputPresetFolder: presetFolder,
                    })
                  }
                  formData={formData?.inputPresetFolder}
                />
                <EditInputEntity
                  formData={formData}
                  setFormData={setFormData}
                  dataSourceId={dataSourceId}
                  onOpen={onOpen}
                />
              </>
            )}
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Output</Typography>
          <GroupWrapper>
            <Column>
              {readOnly ? (
                <ReadOnlyPathTextField
                  label={'Blueprint'}
                  path={formData?.outputType || 'None'}
                />
              ) : (
                <BlueprintPicker
                  onChange={(selectedBlueprint: string) =>
                    setFormData({ ...formData, outputType: selectedBlueprint })
                  }
                  formData={formData?.outputType || ''}
                />
              )}
            </Column>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">SIMA Task</Typography>
          <GroupWrapper>
            {readOnly ? (
              <>
                <Column>
                  <ReadOnlyTextField
                    text={
                      formData.stask?.name || formData.stask?.name || 'None'
                    }
                    label={'Select Stask'}
                  />
                </Column>
                <ReadOnlyTextField
                  text={formData?.workflowTask || 'None'}
                  label={'Workflow task'}
                />
                <ReadOnlyTextField
                  text={formData?.workflow || 'None'}
                  label={'Workflow'}
                />
              </>
            ) : (
              <>
                <Column>
                  <Row>
                    <EntityPickerInput
                      label={'Select Stask'}
                      formData={formData.stask}
                      typeFilter={STaskBlueprint}
                      onChange={(selectedStask: TReference) =>
                        setFormData({
                          ...formData,
                          stask: selectedStask,
                        })
                      }
                    />
                    <div style={{ paddingTop: '16px' }}>
                      <UploadFileButton
                        formData={formData.stask}
                        fileSuffix={['stask']}
                        dataSourceId={dataSourceId}
                        getBody={(filename: string) =>
                          getNewSTaskBody(filename)
                        }
                        onUpload={(createdRef: TReference) =>
                          setFormData({
                            ...formData,
                            stask: createdRef,
                          })
                        }
                      />
                    </div>
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
              </>
            )}
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
              {readOnly ? (
                <ReadOnlyTextField
                  text={formData?.simaInputFilePath || 'None'}
                  label={'Input path'}
                />
              ) : (
                <TextField
                  id="inputPath"
                  label={'Input path'}
                  value={formData?.simaInputFilePath || ''}
                  placeholder="The simulations input file path"
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      simaInputFilePath: event.target.value,
                    })
                  }
                  style={{ width: INPUT_FIELD_WIDTH }}
                />
              )}
            </Tooltip>
            <Tooltip
              enterDelay={300}
              title={'Which file SIMA will write the result into'}
              placement="right"
            >
              {readOnly ? (
                <ReadOnlyTextField
                  text={formData.simaOutputFilePath || 'None'}
                  label={'Output path'}
                />
              ) : (
                <TextField
                  id="outputPath"
                  label={'Output path'}
                  value={formData?.simaOutputFilePath || ''}
                  placeholder="The simulations output file path"
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      simaOutputFilePath: event.target.value,
                    })
                  }
                  style={{ width: INPUT_FIELD_WIDTH }}
                />
              )}
            </Tooltip>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Result</Typography>
          <GroupWrapper>
            <Column>
              {readOnly ? (
                <ReadOnlyPathTextField
                  label={'Folder'}
                  path={formData?.resultPath || 'None'}
                />
              ) : (
                <DestinationPicker
                  label={'Folder'}
                  formData={formData?.resultPath || ''}
                  onChange={(selectedFolder: string) =>
                    setFormData({
                      ...formData,
                      resultPath: selectedFolder,
                    })
                  }
                />
              )}
            </Column>
          </GroupWrapper>
        </HeaderWrapper>
        {!readOnly && (
          <div
            style={{
              justifyContent: 'space-around',
              display: 'flex',
              marginTop: '20px',
            }}
          >
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
              <Button
                as="button"
                onClick={() => updateDocument(formData, true)}
              >
                {!_.isEqual(document, formData) ? 'Save *' : 'Save'}
              </Button>
            )}
          </div>
        )}
      </div>
    </Container>
  )
}

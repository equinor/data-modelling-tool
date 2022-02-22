import {
  BlueprintPicker,
  DmtUIPlugin,
  EntityPicker,
  EntityPickerDropdown,
  TReference,
  UploadFileButton,
  useDocument,
} from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useState } from 'react'
import { Button, Label, TextField, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

const STaskBlueprint = 'AnalysisPlatformDS/Blueprints/STask'

const Wrapper = styled.div`
  margin: 10px;
`

const Column = styled.div`
  display: block;
`

const Row = styled.div`
  display: flex;
`
const GroupWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
`

const HeaderWrapper = styled.div`
  margin-bottom: 50px;
`

export const EditSimaTask = (props: DmtUIPlugin) => {
  const { document, documentId, dataSourceId, onSubmit } = props
  // using the passed updateDocument from props causes way too much rerendering. This should probably be fixed...
  const [_document, documentLoading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId
  )
  const [formData, setFormData] = useState<any>({ ...document })

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
      <div style={{ maxWidth: '900px', width: '100%', marginBottom: '10px' }}>
        <Wrapper>
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
              <div style={{ display: 'flex' }}>
                <Column>
                  <Label label={'Default input entity'} />
                  <EntityPicker
                    formData={formData.defaultInput}
                    onChange={(selectedEntity: TReference) =>
                      setFormData({
                        ...formData,
                        defaultInput: {
                          _id: selectedEntity._id,
                          name: selectedEntity.name,
                          type: selectedEntity.type,
                        },
                      })
                    }
                  />
                </Column>
                <Button style={{ margin: '15px 10px 0 10px' }} disabled>
                  Create
                </Button>
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
            <Typography variant="h3">SIMA Task</Typography>
            <GroupWrapper>
              <Column>
                <Label label={'Select Stask'} />
                <Row>
                  <EntityPickerDropdown
                    onChange={(selectedStask: any) =>
                      setFormData({
                        ...formData,
                        stask: {
                          _id: selectedStask._id,
                          name: selectedStask.name,
                          type: selectedStask.type,
                        },
                      })
                    }
                    typeFilter={STaskBlueprint}
                    dataSourceId={dataSourceId}
                    formData={formData.stask}
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
              </Column>
              <TextField
                id="workflow"
                label={'Workflow'}
                value={formData.workflow}
                placeholder="Name of workflow to run"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, workflow: event.target.value })
                }
                style={{ maxWidth: '280px' }}
              />
              <TextField
                id="workflowTask"
                label={'Workflow task'}
                value={formData.workflowTask}
                placeholder="Name of workflowTask to run"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, workflowTask: event.target.value })
                }
                style={{ maxWidth: '280px' }}
              />
            </GroupWrapper>
          </HeaderWrapper>

          <HeaderWrapper>
            <Typography variant="h3">Job type</Typography>
            <GroupWrapper>
              <Column>
                <Label label={'Blueprint'} />
                <BlueprintPicker
                  onChange={(selectedBlueprint: string) =>
                    setFormData({ ...formData, jobType: selectedBlueprint })
                  }
                  formData={formData.jobType}
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
        </Wrapper>
      </div>
    </div>
  )
}

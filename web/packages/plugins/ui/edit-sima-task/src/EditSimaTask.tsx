import {
  BlueprintPicker,
  DmtUIPlugin,
  EntityPicker,
  EntityPickerDropdown,
  TReference,
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

const ColumnWrapper = styled.div`
  display: block;
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
  const { document, documentId, dataSourceId } = props
  // using the passed updateDocument from props causes way too much rerendering. This should probably be fixed...
  const [_document, documentLoading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId
  )
  const [formData, setFormData] = useState<any>({ ...document })

  return (
    <div style={{ maxWidth: '900px', marginBottom: '10px' }}>
      <Wrapper>
        <HeaderWrapper>
          <Typography variant="h3">Input</Typography>
          <GroupWrapper>
            <ColumnWrapper>
              <Label label={'Blueprint'} />
              <BlueprintPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, inputType: selectedBlueprint })
                }
                formData={formData.inputType}
              />
            </ColumnWrapper>
            <div style={{ display: 'flex' }}>
              <ColumnWrapper>
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
              </ColumnWrapper>
              <Button style={{ margin: '15px 10px 0 10px' }} disabled>
                Create
              </Button>
            </div>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Output</Typography>
          <GroupWrapper>
            <ColumnWrapper>
              <Label label={'Blueprint'} />
              <BlueprintPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, outputType: selectedBlueprint })
                }
                formData={formData.outputType}
              />
            </ColumnWrapper>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">SIMA Task</Typography>
          <GroupWrapper>
            <ColumnWrapper>
              <Label label={'Select Stask'} />
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
            </ColumnWrapper>
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
            <ColumnWrapper>
              <Label label={'Blueprint'} />
              <BlueprintPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, jobType: selectedBlueprint })
                }
                formData={formData.jobType}
              />
            </ColumnWrapper>
          </GroupWrapper>
        </HeaderWrapper>
      </Wrapper>

      <div style={{ justifyContent: 'space-around', display: 'flex' }}>
        <Button
          as="button"
          variant="outlined"
          color="danger"
          onClick={() => setFormData({ ...document })}
        >
          Reset
        </Button>
        <Button as="button" onClick={() => updateDocument(formData, true)}>
          Ok
        </Button>
      </div>
    </div>
  )
}

import { BlueprintPicker, DmtUIPlugin, EntityPicker } from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useState } from 'react'
import { Button, Label, TextField, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

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
`

const HeaderWrapper = styled.div`
  margin-bottom: 50px;
`

export const EditSimaTask = (props: DmtUIPlugin) => {
  const { document, updateDocument, documentId } = props
  const [formData, setFormData] = useState<any>(document)

  return (
    <>
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
            <ColumnWrapper>
              <Label label={'Default input entity'} />
              <EntityPicker
                onChange={(selectedEntity: string) =>
                  setFormData({ ...formData, defaultInput: selectedEntity })
                }
              />
            </ColumnWrapper>
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
              <Label label={'Select Stask from library'} />
              <BlueprintPicker
                onChange={(selectedBlueprint: string) =>
                  setFormData({ ...formData, inputType: selectedBlueprint })
                }
                formData={formData.inputType}
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
                formData={formData.inputType}
              />
            </ColumnWrapper>
          </GroupWrapper>
        </HeaderWrapper>
      </Wrapper>

      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <Button as="button" onClick={() => updateDocument(formData)}>
          Ok
        </Button>
      </div>
    </>
  )
}

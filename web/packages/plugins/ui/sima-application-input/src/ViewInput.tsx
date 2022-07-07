import {
  DmtUIPlugin,
  INPUT_FIELD_WIDTH,
  Loading,
  PATH_INPUT_FIELD_WIDTH,
  truncatePathString,
  useDocument,
} from '@dmt/common'
import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  Input,
  Label,
  TextField,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'

import { Column, Container, GroupWrapper, HeaderWrapper } from './components'

const ReadOnlyPathTextField = (props: { path: string }) => {
  return (
    <Tooltip
      title={truncatePathString(props.path) === props.path ? '' : props.path}
    >
      <Input
        variant={'default'}
        style={{
          width: PATH_INPUT_FIELD_WIDTH,
          cursor: 'default',
        }}
        type="string"
        value={truncatePathString(props.path)}
      />
    </Tooltip>
  )
}

const ReadOnlyTextField = (props: {
  text: string
  label: string
  tooltipText?: string
}) => {
  return (
    <div>
      <Tooltip
        enterDelay={300}
        title={props.tooltipText || ''}
        placement="right"
      >
        <TextField
          id={props.label}
          label={props.label}
          value={props.text}
          style={{ width: INPUT_FIELD_WIDTH, cursor: 'default' }}
        />
      </Tooltip>
    </div>
  )
}

export const ViewInput = (props: DmtUIPlugin) => {
  const { dataSourceId, documentId } = props
  const [formData, setFormData] = useState<any>(null)
  const [document, loading] = useDocument(dataSourceId, documentId)

  useEffect(() => {
    if (!document) return
    setFormData(document)
  }, [document])

  if (loading) return <Loading />
  return (
    <Container>
      <div style={{ marginBottom: '10px' }}>
        <HeaderWrapper>
          <Typography variant="h3">Input</Typography>
          <GroupWrapper>
            <Column>
              <Label label={'Blueprint'} />
              <ReadOnlyPathTextField path={formData?.inputType || 'None'} />
            </Column>
            <ReadOnlyTextField
              text={formData?.input?.name || formData?.input?._id || 'None'}
              label={''}
            />
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Output</Typography>
          <GroupWrapper>
            <Column>
              <Label label={'Blueprint'} />
              <ReadOnlyPathTextField path={formData?.outputType || 'None'} />
            </Column>
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">SIMA Task</Typography>
          <GroupWrapper>
            <Column>
              <ReadOnlyTextField
                text={formData.stask?.name || formData.stask?.name || 'None'}
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
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Input/Output Paths</Typography>
          <GroupWrapper>
            <ReadOnlyTextField
              text={formData?.simaInputFilePath || 'None'}
              label={'Input path'}
              tooltipText={
                "Which file the STask is configured to read it's input from."
              }
            />
            <ReadOnlyTextField
              text={formData?.simaOutputFilePath || 'None'}
              label={'Output path'}
              tooltipText={'Which file SIMA will write the result into'}
            />
          </GroupWrapper>
        </HeaderWrapper>

        <HeaderWrapper>
          <Typography variant="h3">Result</Typography>
          <GroupWrapper>
            <Column>
              <ReadOnlyPathTextField path={formData?.resultPath || 'None'} />
            </Column>
          </GroupWrapper>
        </HeaderWrapper>
      </div>
    </Container>
  )
}

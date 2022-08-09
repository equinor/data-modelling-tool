import {
  Button,
  Card,
  Label,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
import Icons from './Design/Icons'
import React, { useContext, useState } from 'react'
import {
  AccessControlList,
  AuthContext,
  Dialog,
  hasExpertRole,
  hasOperatorRole,
} from '@dmt/common'
import { TAnalysisCardProps } from '../Types'
import { CreateJobButton } from './CreateJobButton'
import styled from 'styled-components'
// @ts-ignore

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`
const CardWrapper = styled.div`
  height: auto;
  width: 400px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(1, auto);
  grid-gap: 32px 32px;
  border-radius: 5px;
`

const AnalysisCard = (props: TAnalysisCardProps) => {
  const { analysis, addJob, jobs, dataSourceId } = props
  const [viewACL, setViewACL] = useState<boolean>(false)

  const { tokenData } = useContext(AuthContext)

  return (
    <CardWrapper>
      <Card style={{ maxWidth: '1200px' }}>
        <Card.Header>
          <Card.HeaderTitle>
            <Typography variant="h5">
              {analysis.label || analysis.name}
            </Typography>
          </Card.HeaderTitle>
        </Card.Header>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <FlexWrapper>
              <Label label="Creator:" />
              {analysis.creator}
            </FlexWrapper>
            <FlexWrapper>
              <Label label="Created:" />
              {new Date(analysis.created).toLocaleString(navigator.language)}
            </FlexWrapper>
            <FlexWrapper>
              <Label label="Updated:" />
              {new Date(analysis.updated).toLocaleString(navigator.language)}
            </FlexWrapper>
            <FlexWrapper>
              <Label label="Description:" />
              {analysis.description}
            </FlexWrapper>
          </div>
        </div>
        {hasOperatorRole(tokenData) && (
          <Card.Actions>
            {'task' in analysis && Object.keys(analysis.task).length > 0 && (
              <>
                <CreateJobButton
                  analysis={analysis}
                  addJob={addJob}
                  jobs={jobs}
                  dataSourceId={dataSourceId}
                />
                {hasExpertRole(tokenData) && (
                  <Tooltip title={'Not implemented'}>
                    <Button style={{ width: 'max-content' }} disabled>
                      Configure schedule
                      <Icons name="time" title="time" />
                    </Button>
                  </Tooltip>
                )}
              </>
            )}
            {hasExpertRole(tokenData) && (
              <Button
                onClick={() => setViewACL(!viewACL)}
                style={{ width: 'max-content' }}
              >
                Access control
                <Icons name="assignment_user" title="assignment_user" />
              </Button>
            )}
          </Card.Actions>
        )}
      </Card>
      <Dialog
        isOpen={viewACL}
        header={'Access control'}
        closeScrim={() => setViewACL(false)}
      >
        <AccessControlList
          documentId={analysis._id}
          dataSourceId={dataSourceId}
        />
      </Dialog>
    </CardWrapper>
  )
}

export default AnalysisCard

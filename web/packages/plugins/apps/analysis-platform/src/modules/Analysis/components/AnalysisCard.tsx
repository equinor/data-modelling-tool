import {
  Button,
  Card,
  Label,
  Progress,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
import { hasExpertRole } from '../../../utils/auth'
import Icons from '../../../components/Design/Icons'
import React, { useContext, useState } from 'react'
import {
  AccessControlList,
  AuthContext,
  Dialog,
  DmssAPI,
  useDocument,
} from '@dmt/common'
import { DEFAULT_DATASOURCE_ID, JOB } from '../../../const'
import styled from 'styled-components'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { poorMansUUID } from '../../../utils/uuid'
import { JobStatus, TAnalysis, TJob, TTask } from '../../../Types'
import { useParams } from 'react-router-dom'
import { AxiosError } from 'axios'

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`
const CardWrapper = styled.div`
  height: auto;
  width: 400px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 320px);
  grid-gap: 32px 32px;
  border-radius: 5px;
`

type AnalysisCardProps = {
  analysis: TAnalysis
  addJob: Function
  jobs: any
}

const RunAnalysisButton = (props: any) => {
  const { analysis, addJob, jobs } = props
  const [loading, setLoading] = useState<boolean>(false)
  const { token, tokenData } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const { data_source, entity_id } = useParams<{
    data_source: string
    entity_id: string
  }>()
  const analysisAbsoluteReference = `${DEFAULT_DATASOURCE_ID}/${analysis._id}`

  const handleCreateJob = () => {
    setLoading(true)

    //fetch last version of task from database
    dmssAPI
      .documentGetById({
        dataSourceId: data_source,
        documentId: entity_id,
        depth: 999, // ???
      })
      .then((response: any) => {
        const task = response.data.task
        createJob(task)
        // setError(null)
      })
      .catch((error: AxiosError) => console.log(error))
      .finally(() => setLoading(false))
    // createJob("x")
  }

  const createJob = (task: TTask) => {
    setLoading(true)
    const runsSoFar = jobs.length

    if (!task.runner || Object.keys(task.runner).length === 0) {
      NotificationManager.error(
        'You must save the job runner before creating the job!'
      )
      setLoading(false)
      return
    }

    const job: TJob = {
      label: 'Example local container job',
      name: `${analysis._id}.jobs.${runsSoFar}-${poorMansUUID(1)}`,
      type: JOB,
      status: JobStatus.CREATED,
      triggeredBy: tokenData?.name,
      applicationInput: task.applicationInput,
      runner: task.runner,
      referenceTarget: `${analysis._id}.jobs.${runsSoFar}.result`,
      started: '',
    }

    dmssAPI
      .explorerAdd({
        absoluteRef: `${analysisAbsoluteReference}.jobs`,
        updateUncontained: false,
        body: job,
      })
      .then(() => addJob(job))
      .catch((error: Error) => {
        console.error(error)
        NotificationManager.error(`Could not save job (${error})`)
      })

      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      {loading ? (
        <Button style={{ width: '130px' }}>
          <Progress.Dots />
        </Button>
      ) : (
        <Button style={{ width: '130px' }} onClick={() => handleCreateJob()}>
          New job
          <Icons name="add" title="new job" />
        </Button>
      )}
    </div>
  )
}

const AnalysisCard = (props: AnalysisCardProps) => {
  const { analysis, addJob, jobs } = props
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
        <Card.Actions>
          {'task' in analysis && Object.keys(analysis.task).length > 0 && (
            <>
              <RunAnalysisButton
                analysis={analysis}
                addJob={addJob}
                jobs={jobs}
              />
              <Tooltip title={'Not implemented'}>
                <Button style={{ width: 'max-content' }} disabled>
                  Configure schedule
                  <Icons name="time" title="time" />
                </Button>
              </Tooltip>
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
      </Card>
      <Dialog
        isOpen={viewACL}
        header={'Access control'}
        closeScrim={() => setViewACL(false)}
      >
        <AccessControlList
          documentId={analysis._id}
          dataSourceId={DEFAULT_DATASOURCE_ID}
        />
      </Dialog>
    </CardWrapper>
  )
}

export default AnalysisCard

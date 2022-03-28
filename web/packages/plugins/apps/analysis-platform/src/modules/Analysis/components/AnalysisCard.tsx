import {
  Button,
  Card,
  Label,
  Progress,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
import { hasExpertRole } from '../../../utils/auth'
import { AxiosError } from 'axios'
import Icons from '../../../components/Design/Icons'
import React, { useContext, useState } from 'react'
import { TAnalysis } from '../Types'
import { CustomScrim } from '../../../components/CustomScrim'
import {
  AccessControlList,
  AuthContext,
  DmssAPI,
  UIPluginSelector,
  JobApi,
} from '@dmt/common'
import {
  ANALYSIS_RESULTS_PATH,
  DEFAULT_DATASOURCE_ID,
  JOB,
} from '../../../const'
import styled from 'styled-components'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { TJob, TTask, TSIMAApplicationInput } from '../../../Types'

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
  const [showScrim, setShowScrim] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { token, tokenData } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const jobAPI = new JobApi(token)

  const analysisAbsoluteReference = `${DEFAULT_DATASOURCE_ID}/${analysis._id}`

  const applicationInputHasCorrectType = (job: TJob) => {
    if (!job.applicationInput.input.includes(job.applicationInput.inputType)) {
      return false
    }
    return true
  }

  const saveAndStartJob = (task: TTask) => {
    setLoading(true)
    const runsSoFar = jobs.length

    dmssAPI
      .getDocumentById({
        dataSourceId: DEFAULT_DATASOURCE_ID,
        documentId: task.applicationInput._id,
        depth: 0,
      })
      .then((applicationInputEntity: TSIMAApplicationInput) => {
        const localContainerJob: TJob = {
          label: 'Example local container job',
          name: `${analysis._id}.jobs.${runsSoFar}`,
          type: JOB,
          triggeredBy: tokenData?.name,
          applicationInput: applicationInputEntity,
          runner: task.runner,
          started: new Date().toISOString(),
        }

        if (!applicationInputHasCorrectType(localContainerJob)) {
          throw new Error(
            `type ${localContainerJob.applicationInput.inputType} not found in the application input entity!`
          )
        }

        dmssAPI.generatedDmssApi
          .explorerAdd({
            absoluteRef: `${analysisAbsoluteReference}.jobs`,
            updateUncontained: false,
            body: localContainerJob,
          })
          .then(() => {
            // Start a job from the created job entity (last one in list)
            jobAPI
              .startJob(`${analysisAbsoluteReference}.jobs.${runsSoFar}`)
              .then((result: any) => {
                addJob(localContainerJob)
                NotificationManager.success(
                  JSON.stringify(result.data),
                  'Simulation job started'
                )
              })
              .catch((error: AxiosError) => {
                console.error(error)
                NotificationManager.error(
                  error?.response?.data?.message,
                  'Failed to start job'
                )
              })
          })
      })
      .catch((error: any) => {
        NotificationManager.error(`Error occured when starting job (${error})`)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading) {
    return <Progress.Linear />
  }

  return (
    <div>
      <Button
        onClick={() => setShowScrim(true)}
        style={{ width: 'max-content' }}
      >
        Run analysis
        <Icons name="play" title="play" />
      </Button>
      {showScrim && (
        <CustomScrim
          closeScrim={() => setShowScrim(false)}
          header={'Job parameters'}
        >
          <UIPluginSelector
            absoluteDottedId={`${analysisAbsoluteReference}.task`}
            entity={analysis.task}
            onSubmit={(task: TTask) => {
              saveAndStartJob(task)
              setShowScrim(false)
              NotificationManager.success('Job parameters updated', 'Updated')
            }}
            categories={['container']}
          />
        </CustomScrim>
      )}
    </div>
  )
}

const AnalysisCard = (props: AnalysisCardProps) => {
  const { analysis, addJob, jobs } = props
  const [viewACL, setViewACL] = useState<boolean>(false)
  // @ts-ignore
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
          {hasExpertRole(tokenData) && (
            <Button
              onClick={() => setViewACL(!viewACL)}
              style={{ width: 'max-content' }}
            >
              Access control
              <Icons name="assignment_user" title="assignment_user" />
            </Button>
          )}
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
        </Card.Actions>
      </Card>
      {viewACL && (
        <CustomScrim
          header={'Access control'}
          closeScrim={() => setViewACL(false)}
        >
          <AccessControlList
            documentId={analysis._id}
            dataSourceId={DEFAULT_DATASOURCE_ID}
          />
        </CustomScrim>
      )}
    </CardWrapper>
  )
}

export default AnalysisCard

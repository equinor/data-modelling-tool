import {
  Button,
  Icon,
  Progress,
  Table,
  Typography,
} from '@equinor/eds-core-react'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, DmssAPI, JobApi } from '@dmt/common'
import { hasExpertRole } from '@dmt/analysis-platform'
import { DEFAULT_DATASOURCE_ID } from '../../../const'
import styled from 'styled-components'
import { JobStatus, TJob } from '../../../Types'
import { AxiosError } from 'axios'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

type AnalysisJobTableProps = {
  jobs: any
  analysisId: string
}

const ClickableLabel = styled.div`
  cursor: pointer;
  color: blue;
  text-decoration-line: underline;
`

const JobRow = (props: { job: TJob; index: number; analysisId: string }) => {
  const { job, index, analysisId } = props // @ts-ignore
  const { token, tokenData } = useContext(AuthContext)
  const jobAPI = new JobApi(token)
  const dmssAPI = new DmssAPI(token)
  const [loading, setLoading] = useState<boolean>(false)
  const [jobStatus, setJobStatus] = useState<JobStatus>(JobStatus.UNKNOWN)
  const jobURL = `/ap/view/${DEFAULT_DATASOURCE_ID}/${analysisId}.jobs.${index}`
  const resultURL = job.result?._id
    ? `/ap/view/${DEFAULT_DATASOURCE_ID}/${job.result?._id}`
    : undefined
  const viewURL = hasExpertRole(tokenData) ? jobURL : resultURL

  const viewResult = () => {
    if (viewURL) {
      document.location = viewURL
    } else {
      NotificationManager.warning('Result is not ready')
    }
  }

  const startJob = () => {
    setLoading(true)
    jobAPI
      .startJob(`${DEFAULT_DATASOURCE_ID}/${analysisId}.jobs.${index}`)
      .then((result: any) => {
        NotificationManager.success(
          JSON.stringify(result.data),
          'Simulation job started'
        )
        setJobStatus(JobStatus.STARTING)
      })
      .catch((error: AxiosError) => {
        console.error(error)
        NotificationManager.error(
          //@ts-ignore
          error?.response?.data?.message || error.message,
          'Failed to start job'
        )
      })
      .finally(() => setLoading(false))
  }

  async function removeJob(): Promise<void> {
    NotificationManager.warning('Not implemented')
    return
    setLoading(true)
    try {
      await dmssAPI.explorerRemove({
        dataSourceId: DEFAULT_DATASOURCE_ID,
        dottedId: `${analysisId}.jobs.${index}`,
      })
      await jobAPI.removeJob(
        `${DEFAULT_DATASOURCE_ID}/${analysisId}.jobs.${index}`
      )
      setLoading(false)
    } catch (error) {
      console.error(error)
      NotificationManager.error(
        //@ts-ignore
        error?.response?.data?.message || error.message,
        'Failed to start job'
      )
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    jobAPI
      .statusJob(`${DEFAULT_DATASOURCE_ID}/${analysisId}.jobs.${index}`)
      .then((result: any) => {
        setJobStatus(result.data.status)
      })
      .catch((e: Error) => {
        console.error(e)
        setJobStatus(job.status)
      })
      .finally(() => setLoading(false))
  }, [])
  return (
    <Table.Row>
      <Table.Cell onClick={viewResult}>
        {jobStatus !== JobStatus.CREATED
          ? new Date(job.started).toLocaleString(navigator.language)
          : 'Not started'}
      </Table.Cell>
      <Table.Cell onClick={viewResult}>{job.triggeredBy}</Table.Cell>
      <Table.Cell onClick={viewResult}>{jobStatus}</Table.Cell>
      <Table.Cell>
        {Object.keys(job?.result || {}).length ? (
          <ClickableLabel
            onClick={() => {
              window.open(resultURL, '_blank')
            }}
          >
            Open
          </ClickableLabel>
        ) : (
          <>None</>
        )}
      </Table.Cell>
      {loading ? (
        <Table.Cell>
          <Progress.Circular style={{ height: '24px' }} />
        </Table.Cell>
      ) : (
        hasExpertRole(tokenData) && (
          <Table.Cell>
            {jobStatus === JobStatus.CREATED ? (
              <Button variant="ghost_icon" onClick={() => startJob()}>
                <Icon name="play" title="play" />
              </Button>
            ) : (
              <Button
                variant="ghost_icon"
                color="danger"
                onClick={() => removeJob()}
              >
                <Icon name="delete_forever" title="delete" />
              </Button>
            )}
          </Table.Cell>
        )
      )}
    </Table.Row>
  )
}

export const AnalysisJobTable = (props: AnalysisJobTableProps) => {
  const { jobs, analysisId } = props
  const { tokenData } = useContext(AuthContext)

  return (
    <>
      <Table style={{ width: '100%' }}>
        <Table.Caption>
          <Typography variant="h3">Runs</Typography>
        </Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Started</Table.Cell>
            <Table.Cell>Started by</Table.Cell>
            <Table.Cell>Status</Table.Cell>
            <Table.Cell>Result</Table.Cell>
            {hasExpertRole(tokenData) && <Table.Cell>Control</Table.Cell>}
          </Table.Row>
        </Table.Head>
        <Table.Body style={{ cursor: 'pointer' }}>
          {jobs.map((job: TJob, index: number) => (
            <JobRow
              key={index}
              job={job}
              index={index}
              analysisId={analysisId}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

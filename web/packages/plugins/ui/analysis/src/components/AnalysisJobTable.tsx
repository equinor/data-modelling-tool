import {
  Button,
  Icon,
  Progress,
  Table,
  Tooltip,
  Typography,
} from '@equinor/eds-core-react'
import React, { useContext, useEffect, useState } from 'react'
import {
  AuthContext,
  DmssAPI,
  JobApi,
  EJobStatus,
  TJob,
  hasOperatorRole,
} from '@dmt/common'
import styled from 'styled-components'
import { AxiosError } from 'axios'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

type AnalysisJobTableProps = {
  jobs: any
  analysisId: string
  dataSourceId: string
}

const ClickableLabel = styled.div`
  cursor: pointer;
  color: blue;
  text-decoration-line: underline;
`

const JobRow = (props: {
  job: TJob
  index: number
  analysisId: string
  dataSourceId: string
}) => {
  const { job, index, analysisId, dataSourceId } = props // @ts-ignore
  const { token, tokenData } = useContext(AuthContext)
  const jobAPI = new JobApi(token)
  const dmssAPI = new DmssAPI(token)
  const [loading, setLoading] = useState<boolean>(false)
  const [jobStatus, setJobStatus] = useState<EJobStatus>(EJobStatus.UNKNOWN)
  const jobURL = `/ap/view/${dataSourceId}/${analysisId}.jobs.${index}`
  const resultURL = job.result?._id
    ? `/ap/view/${dataSourceId}/${job.result?._id}`
    : undefined

  const viewJob = () => {
    if (hasOperatorRole(tokenData)) {
      document.location = jobURL
    } else {
      if (resultURL) {
        document.location = resultURL
      } else {
        NotificationManager.warning('Result is not ready')
      }
    }
  }

  const startJob = () => {
    setLoading(true)
    jobAPI
      .startJob(`${dataSourceId}/${analysisId}.jobs.${index}`)
      .then((result: any) => {
        NotificationManager.success(result.data, 'Simulation job started')
        setJobStatus(EJobStatus.STARTING)
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
    setLoading(true)
    try {
      await dmssAPI.explorerRemove({
        dataSourceId: dataSourceId,
        dottedId: `${analysisId}.jobs.${index}`,
      })
      await jobAPI.removeJob(`${dataSourceId}/${analysisId}.jobs.${index}`)
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
      .statusJob(`${dataSourceId}/${analysisId}.jobs.${index}`)
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
      <Table.Cell onClick={viewJob}>
        {jobStatus !== EJobStatus.CREATED
          ? new Date(job.started).toLocaleString(navigator.language)
          : 'Not started'}
      </Table.Cell>
      <Table.Cell onClick={viewJob}>{job.triggeredBy}</Table.Cell>
      <Table.Cell onClick={viewJob}>{jobStatus}</Table.Cell>
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
      ) : hasOperatorRole(tokenData) ? (
        <Table.Cell>
          {jobStatus === EJobStatus.CREATED ? (
            <Button variant="ghost_icon" onClick={() => startJob()}>
              <Icon name="play" title="play" />
            </Button>
          ) : (
            <Tooltip title={'Not implemented'}>
              <Button
                variant="ghost_icon"
                color="danger"
                disabled
                onClick={() => removeJob()}
              >
                <Icon name="delete_forever" title="delete" />
              </Button>
            </Tooltip>
          )}
        </Table.Cell>
      ) : (
        <></>
      )}
    </Table.Row>
  )
}

export const AnalysisJobTable = (props: AnalysisJobTableProps) => {
  const { jobs, analysisId, dataSourceId } = props
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
            {hasOperatorRole(tokenData) && <Table.Cell>Control</Table.Cell>}
          </Table.Row>
        </Table.Head>
        <Table.Body style={{ cursor: 'pointer' }}>
          {jobs.map((job: TJob, index: number) => (
            <JobRow
              key={index}
              job={job}
              index={index}
              analysisId={analysisId}
              dataSourceId={dataSourceId}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  )
}

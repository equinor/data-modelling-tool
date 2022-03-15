import { Table, Typography } from '@equinor/eds-core-react'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, JobApi } from '@dmt/common'
import { DEFAULT_DATASOURCE_ID } from '../../../const'
import styled from 'styled-components'

type AnalysisJobTableProps = {
  jobs: any
  analysisId: string
}

enum JobStatus {
  STARTING = 'starting',
  RUNNING = 'running',
  FAILED = 'failed',
  COMPLETED = 'completed',
  UNKNOWN = 'unknown',
}

const ClickableLabel = styled.div`
  cursor: pointer;
  color: blue;
  text-decoration-line: underline;
`

const JobRow = (props: any) => {
  const { job, index, analysisId } = props // @ts-ignore
  const { token } = useContext(AuthContext)
  const JobAPI = new JobApi(token)
  const [loading, setLoading] = useState<boolean>(false)
  const [jobStatus, setJobStatus] = useState<JobStatus>(JobStatus.UNKNOWN)

  useEffect(() => {
    setLoading(true)
    JobAPI.statusJob(`${DEFAULT_DATASOURCE_ID}/${analysisId}.jobs.${index}`)
      .then((result: any) => {
        setJobStatus(result.data.status)
      })
      .catch((e: Error) => {
        console.error(e)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Table.Row
      key={index}
      onClick={() => {
        document.location = `/ap/view/${DEFAULT_DATASOURCE_ID}/${analysisId}.jobs.${index}`
      }}
    >
      <Table.Cell>
        {new Date(job.started).toLocaleString(navigator.language)}
      </Table.Cell>
      <Table.Cell>{job.triggeredBy}</Table.Cell>
      <Table.Cell>{}</Table.Cell>
      <Table.Cell>{jobStatus}</Table.Cell>
      <Table.Cell>
        <ClickableLabel
          onClick={(e) => {
            window.open(
              `/ap/view/AnalysisPlatformDS/${job.result?._id}`,
              '_blank'
            )
            e.stopPropagation()
          }}
        >
          Open
        </ClickableLabel>
      </Table.Cell>
    </Table.Row>
  )
}

const AnalysisJobTable = (props: AnalysisJobTableProps) => {
  const { jobs, analysisId } = props

  return (
    <>
      <Table density="comfortable" style={{ width: '100%' }}>
        <Table.Caption>
          <Typography variant="h3">Runs</Typography>
        </Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Started</Table.Cell>
            <Table.Cell>Started by</Table.Cell>
            <Table.Cell>Duration</Table.Cell>
            <Table.Cell>Status</Table.Cell>
            <Table.Cell>Result</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body style={{ cursor: 'pointer' }}>
          {jobs.map((job: any, index: number) => (
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

export default AnalysisJobTable

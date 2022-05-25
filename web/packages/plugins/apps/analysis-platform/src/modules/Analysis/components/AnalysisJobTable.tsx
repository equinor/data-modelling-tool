import { Button, Icon, Table, Typography } from '@equinor/eds-core-react'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, JobApi } from '@dmt/common'
import { DEFAULT_DATASOURCE_ID } from '../../../const'
import styled from 'styled-components'
import { JobStatus, TJob } from '../../../Types'

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
        setJobStatus(job.status)
      })
      .finally(() => setLoading(false))
  }, [])
  console.log(jobStatus)
  return (
    <Table.Row
      onClick={() => {
        //@ts-ignore
        document.location = `/ap/view/${DEFAULT_DATASOURCE_ID}/${analysisId}.jobs.${index}`
      }}
    >
      <Table.Cell>
        {jobStatus !== JobStatus.CREATED
          ? new Date(job.started).toLocaleString(navigator.language)
          : 'Not started'}
      </Table.Cell>
      <Table.Cell>{job.triggeredBy}</Table.Cell>
      <Table.Cell>{}</Table.Cell>
      <Table.Cell>{jobStatus}</Table.Cell>
      <Table.Cell>
        {Object.keys(job?.result || {}).length ? (
          <ClickableLabel
            onClick={() => {
              window.open(
                `/ap/view/${DEFAULT_DATASOURCE_ID}/${job.result?._id}`,
                '_blank'
              )
            }}
          >
            Open
          </ClickableLabel>
        ) : (
          <>None</>
        )}
      </Table.Cell>
      <Table.Cell>
        {jobStatus === JobStatus.CREATED ? (
          <Button variant="ghost_icon">
            <Icon name="play" title="play" />
          </Button>
        ) : (
          <Button variant="ghost_icon" color="danger">
            <Icon name="delete_forever" title="delete" />
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  )
}

const AnalysisJobTable = (props: AnalysisJobTableProps) => {
  const { jobs, analysisId } = props

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
            <Table.Cell>Duration</Table.Cell>
            <Table.Cell>Status</Table.Cell>
            <Table.Cell>Result</Table.Cell>
            <Table.Cell>Control</Table.Cell>
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

export default AnalysisJobTable

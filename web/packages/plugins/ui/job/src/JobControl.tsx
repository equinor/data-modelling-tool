import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  AuthContext,
  Dialog,
  DmssAPI,
  JobApi,
  UIPluginSelector,
} from '@dmt/common'
import { Button, Label, Progress } from '@equinor/eds-core-react'
import Icons from './Icons'
import { AxiosError } from 'axios'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { JobStatus, TJob } from './types'

const StyledPre = styled.pre`
  display: flex;
  white-space: pre-line;
  background-color: black;
  color: rgb(83, 248, 2);
`

const RowGroup = styled.div`
  display: flex;
  align-items: center;
`

const ClickableLabel = styled.div`
  cursor: pointer;
  color: blue;
  text-decoration-line: underline;
`

function colorFromStatus(status: string): string {
  switch (status) {
    case JobStatus.CREATED:
      return 'slateblue'
    case JobStatus.STARTING:
      return 'orange'
    case JobStatus.RUNNING:
      return 'orange'
    case JobStatus.COMPLETED:
      return 'green'
    case JobStatus.FAILED:
      return 'red'
    default:
      return 'darkgrey'
  }
}

const SimStatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: large;
  height: 25px;
  align-content: baseline;
  border-radius: 5px;
  padding: 0 10px;
  margin-left: 10px;
  border: ${(props: any) => `${colorFromStatus(props.status)} 3px solid`};
  color: ${(props: any) => colorFromStatus(props.status)};
`

export const JobControl = (props: {
  document: TJob
  jobId: string
  updateDocument: Function
}) => {
  const { jobId, document } = props
  const [dataSourceId, documentId] = jobId.split('/', 2)
  const { token } = useContext(AuthContext)
  const jobAPI = new JobApi(token)
  const dmssAPI = new DmssAPI(token)
  const [loading, setLoading] = useState<boolean>(false)
  const [jobLogs, setJobLogs] = useState<any>()
  const [jobStatus, setJobStatus] = useState<JobStatus>(document.status)
  const [refreshCount, setRefreshCount] = useState<number>(0)
  const [runnerModal, setRunnerModal] = useState<boolean>(false)
  const [inputModal, setInputModal] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    jobAPI
      .statusJob(jobId)
      .then((result: any) => {
        setJobLogs(result.data.log)
        setJobStatus(result.data.status)
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          //@ts-ignore
          setJobLogs(error?.response?.data?.message || error.message)
          setJobStatus(document.status)
        } else setJobLogs('Error occurred when getting status for job')

        // setJobStatus(SimulationStatus.FAILED)
        console.error(error)
      })
      .finally(() => setLoading(false))
  }, [jobId, refreshCount])

  const startJob = () => {
    setLoading(true)
    jobAPI
      .startJob(jobId)
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
    setLoading(true)
    try {
      await jobAPI.removeJob(jobId)
      await dmssAPI.explorerRemove({
        dataSourceId: dataSourceId,
        dottedId: documentId,
      })
    } catch (error) {
      console.error(error)
      NotificationManager.error(
        //@ts-ignore
        error?.response?.data?.message || error.message,
        'Failed to remove job'
      )
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
      }}
    >
      <Dialog
        isOpen={runnerModal}
        closeScrim={() => setRunnerModal(false)}
        header={'Jobs runner configuration'}
        width={'50vw'}
        height={'70vh'}
      >
        {!!document.runner ? (
          <UIPluginSelector
            categories={['view']}
            entity={document.runner}
            absoluteDottedId={`${jobId}.runner`}
          />
        ) : (
          <pre>None</pre>
        )}
      </Dialog>
      <Dialog
        isOpen={inputModal}
        closeScrim={() => setInputModal(false)}
        header={'Jobs input'}
        height={'80vh'}
        width={'50vw'}
      >
        {!!document.applicationInput ? (
          <UIPluginSelector
            categories={['view']}
            entity={document.applicationInput}
            absoluteDottedId={`${jobId.split('/', 1)[0]}/${
              document.applicationInput._id
            }`}
          />
        ) : (
          <pre>None</pre>
        )}
      </Dialog>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <RowGroup>
          <Label label="Status:" />
          {/*@ts-ignore*/}
          <SimStatusWrapper status={jobStatus}>{jobStatus}</SimStatusWrapper>
        </RowGroup>
        <RowGroup>
          <Label label="Started by:" />
          <label>{document.triggeredBy}</label>
        </RowGroup>
        <RowGroup>
          <Label label="Started:" />
          {document.status === JobStatus.CREATED ? (
            <label>Not started</label>
          ) : (
            <label>
              {new Date(document.started).toLocaleString(navigator.language)}
              {' (local)'}
            </label>
          )}
        </RowGroup>
        <RowGroup>
          <Label label="Runner:" />
          <ClickableLabel onClick={() => setRunnerModal(true)}>
            View
          </ClickableLabel>
        </RowGroup>
        <RowGroup>
          <Label label="input:" />
          <ClickableLabel onClick={() => setInputModal(true)}>
            View
          </ClickableLabel>
        </RowGroup>
        <RowGroup>
          <Label label="Result:" />
          {Object.keys(document?.result || {}).length ? (
            <ClickableLabel
              onClick={() =>
                window.open(
                  `/ap/view/AnalysisPlatformDS/${document.result?._id}`,
                  '_blank'
                )
              }
            >
              Open
            </ClickableLabel>
          ) : (
            <>None</>
          )}
        </RowGroup>
      </div>
      <div
        style={{
          display: 'flex',
          paddingTop: '20px',
          justifyContent: 'space-between',
          flexDirection: 'row-reverse',
        }}
      >
        <Button
          onClick={() => setRefreshCount(refreshCount + 1)}
          variant="outlined"
        >
          <Icons name="refresh" title="refresh" />
        </Button>
        {jobStatus === JobStatus.CREATED && (
          <Button style={{ width: '150px' }} onClick={() => startJob()}>
            Start job
            <Icons name="play" title="play" />
          </Button>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '5px',
        }}
      >
        <h4 style={{ alignSelf: 'self-end' }}>Logs:</h4>
      </div>
      {loading ? (
        <Progress.Dots color="primary" />
      ) : (
        <div style={{ paddingBottom: '20px' }}>
          <StyledPre>{jobLogs}</StyledPre>
        </div>
      )}
    </div>
  )
}

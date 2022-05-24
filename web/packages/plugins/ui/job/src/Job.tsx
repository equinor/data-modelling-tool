import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { AuthContext, Dialog, JobApi, UIPluginSelector } from '@dmt/common'
import { Button, Label } from '@equinor/eds-core-react'
import Icons from './Icons'
import { AxiosError } from 'axios'

const StyledPre = styled.pre`
  display: flex;
  white-space: pre-line;
`

enum SimulationStatus {
  STARTING = 'starting',
  RUNNING = 'running',
  FAILED = 'failed',
  COMPLETED = 'completed',
  UNKNOWN = 'unknown',
}

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
    case SimulationStatus.COMPLETED:
      return 'green'
    case SimulationStatus.FAILED:
      return 'red'
    case SimulationStatus.RUNNING:
      return 'orange'
    default:
      return 'darkgrey'
  }
}

const SimStatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: large;
  height: 35px;
  align-content: baseline;
  border-radius: 5px;
  padding: 0 10px;
  margin-left: 10px;
  border: ${(props: any) => `${colorFromStatus(props.status)} 3px solid`};
  color: ${(props: any) => colorFromStatus(props.status)};
`

export const JobLog = (props: { document: any; jobId: string }) => {
  const { jobId, document } = props
  const { token } = useContext(AuthContext)
  const jobAPI = new JobApi(token)
  const [loading, setLoading] = useState<boolean>(false)
  const [jobLogs, setJobLogs] = useState<any>()
  const [jobStatus, setJobStatus] = useState<SimulationStatus>(
    SimulationStatus.UNKNOWN
  )
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
        } else setJobLogs('Error occurred when getting status for job')

        // setJobStatus(SimulationStatus.FAILED)
        console.error(error)
      })
      .finally(() => setLoading(false))
  }, [jobId, refreshCount])

  if (loading) return <pre>Loading...</pre>

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
        width={'30vw'}
      >
        <StyledPre>
          {JSON.stringify(
            document?.runner || 'There is no runner config for this job',
            null,
            2
          )}{' '}
        </StyledPre>
      </Dialog>
      <Dialog
        isOpen={inputModal}
        closeScrim={() => setInputModal(false)}
        header={'Jobs input'}
        width={'30vw'}
      >
        {!!document.applicationInput ? (
          <UIPluginSelector
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
          <label>
            {new Date(document.started).toLocaleString(navigator.language)}
            {' (local)'}
          </label>
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
          justifyContent: 'space-between',
          margin: '10px',
        }}
      >
        <h4 style={{ alignSelf: 'self-end' }}>Logs:</h4>
        <Button
          onClick={() => setRefreshCount(refreshCount + 1)}
          variant="outlined"
        >
          <Icons name="refresh" title="refresh" />
        </Button>
      </div>
      <div style={{ paddingBottom: '20px' }}>
        <StyledPre>{jobLogs}</StyledPre>
      </div>
    </div>
  )
}

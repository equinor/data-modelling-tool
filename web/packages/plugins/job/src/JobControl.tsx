import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  AuthContext,
  Dialog,
  DmssAPI,
  DmtAPI,
  ErrorResponse,
  UIPluginSelector,
  EJobStatus,
  TJob,
  ApplicationContext,
} from '@development-framework/dm-core'
import { Button, Label, Progress } from '@equinor/eds-core-react'
import Icons from './Icons'
import { AxiosError } from 'axios'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

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
    case EJobStatus.CREATED:
      return 'slateblue'
    case EJobStatus.STARTING:
      return 'orange'
    case EJobStatus.RUNNING:
      return 'orange'
    case EJobStatus.COMPLETED:
      return 'green'
    case EJobStatus.FAILED:
      return 'red'
    default:
      return 'darkgrey'
  }
}

interface ISimStatusWrapper {
  status: string
}

const SimStatusWrapper = styled.div<ISimStatusWrapper>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: large;
  height: 25px;
  align-content: baseline;
  border-radius: 5px;
  padding: 0 10px;
  margin-left: 10px;
  border: ${(props: ISimStatusWrapper) =>
    `${colorFromStatus(props.status)} 3px solid`};
  color: ${(props: ISimStatusWrapper) => colorFromStatus(props.status)};
`

function isAxiosError(candidate: any): candidate is AxiosError<ErrorResponse> {
  return candidate.isAxiosError === true
}

export const JobControl = (props: {
  document: TJob
  jobId: string
  updateDocument: (newDocument: any, notify: boolean) => void
}) => {
  const { jobId, document } = props
  const [dataSourceId, documentId] = jobId.split('/', 2)
  const { token } = useContext(AuthContext)
  const settings = useContext(ApplicationContext)
  const dmtApi = new DmtAPI(token)
  const dmssApi = new DmssAPI(token)
  const [loading, setLoading] = useState<boolean>(false)
  const [jobUID, setJobUID] = useState<string | undefined>(document?.uid)
  const [jobLogs, setJobLogs] = useState<any>()
  const [jobStatus, setJobStatus] = useState<EJobStatus>(document.status)
  const [refreshCount, setRefreshCount] = useState<number>(0)
  const [runnerModal, setRunnerModal] = useState<boolean>(false)
  const [inputModal, setInputModal] = useState<boolean>(false)
  const [showLogs, setShowLogs] = useState<boolean>(false)

  useEffect(() => {
    if (!jobUID) return // job has not been started
    setLoading(true)
    dmtApi
      .jobStatus({ jobUid: jobUID })
      .then((result: any) => {
        setJobLogs(result.data.log)
        setJobStatus(result.data.status)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        setJobLogs(error.message)
        setJobStatus(document.status)
      })
      .finally(() => setLoading(false))
  }, [jobId, refreshCount])

  const startJob = () => {
    setLoading(true)
    dmtApi
      .startJob({ jobDmssId: jobId })
      .then((result: any) => {
        NotificationManager.success(
          JSON.stringify(result.data.message),
          'Simulation job started'
        )
        setJobUID(result.data.uid)
        setJobLogs(result.data.message)
        setJobStatus(EJobStatus.STARTING)
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        console.error(error)
        NotificationManager.error(
          error.response?.data.message,
          'Failed to start job'
        )
      })
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function removeJob(): Promise<void> {
    if (!jobUID) return // job has not been started
    setLoading(true)
    try {
      await dmtApi.removeJob({ jobUid: jobUID })
      await dmssApi.documentRemove({
        dataSourceId: dataSourceId,
        dottedId: documentId,
      })
    } catch (error: AxiosError<ErrorResponse> | any) {
      if (isAxiosError(error)) {
        console.error(error.response?.data)
        NotificationManager.error(
          error.response?.data.message,
          'Failed to remove job'
        )
      } else {
        console.log(error)
      }
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
        {document.runner ? (
          <UIPluginSelector
            categories={['view']}
            type={document.runner.type}
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
        {document.applicationInput ? (
          <UIPluginSelector
            categories={['view']}
            type={document.applicationInput.type}
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
          <SimStatusWrapper status={jobStatus}>{jobStatus}</SimStatusWrapper>
        </RowGroup>
        <RowGroup>
          <Label label="Started by:" />
          <label>{document.triggeredBy}</label>
        </RowGroup>
        <RowGroup>
          <Label label="Started:" />
          {document.status === EJobStatus.CREATED ? (
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
                // TODO: Avoid hardcoded DataSource?
                window.open(
                  `/${settings.urlPath}/view/AnalysisPlatformDS/${document.result?._id}`,
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
          marginTop: '20px',
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
        {jobStatus === EJobStatus.CREATED && (
          <Button style={{ width: '150px' }} onClick={() => startJob()}>
            Start job
            <Icons name="play" title="play" />
          </Button>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: '25px',
        }}
      >
        <h4 style={{ alignSelf: 'self-end', marginRight: '10px' }}>Logs:</h4>
        <Button
          style={{ height: '20px' }}
          variant="outlined"
          onClick={() => setShowLogs(!showLogs)}
        >
          {(showLogs && 'Hide') || 'View'}
        </Button>
      </div>
      {showLogs && (
        <>
          {loading ? (
            <Progress.Dots color="primary" />
          ) : (
            <div style={{ paddingBottom: '20px' }}>
              <StyledPre>{jobLogs}</StyledPre>
            </div>
          )}
        </>
      )}
    </div>
  )
}

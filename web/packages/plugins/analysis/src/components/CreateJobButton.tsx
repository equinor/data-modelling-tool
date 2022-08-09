import { Button, Progress } from '@equinor/eds-core-react'
import Icons from './Design/Icons'
import React, { useContext, useState } from 'react'
import {
  AuthContext,
  DmssAPI,
  poorMansUUID,
  EJobStatus,
  TJob,
  EBlueprint,
} from '@dmt/common'
import { TAnalysis, TTask } from '../Types'
// @ts-ignore
import { NotificationManager } from 'react-notifications'

export const CreateJobButton = (props: {
  analysis: TAnalysis
  addJob: (job: TJob) => void
  jobs: any
  dataSourceId: string
}) => {
  const { analysis, addJob, jobs, dataSourceId } = props
  const [loading, setLoading] = useState<boolean>(false)
  const { token, tokenData } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  const analysisAbsoluteReference = `${dataSourceId}/${analysis._id}`

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
      type: EBlueprint.JOB,
      status: EJobStatus.CREATED,
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
        <Button
          style={{ width: '130px' }}
          onClick={() => createJob(analysis.task)}
        >
          New job
          <Icons name="add" title="new job" />
        </Button>
      )}
    </div>
  )
}

import {
  TReference,
  TJob,
  TJobHandler,
  TContainerJobHandler,
} from '@dmt/common'

export type TTask = {
  type: string
  name: string
  description: string
  label: string
  inputType: string
  outputType: string
  applicationInput: TReference
  runner?: TJobHandler | TContainerJobHandler
}

export type TAnalysis = {
  _id: string
  type: string
  name: string
  description: string
  created: string
  updated: string
  label?: string
  creator: string
  schedule: string
  task: TTask
  jobs: TJob[]
}

export type TAnalysisCardProps = {
  analysis: TAnalysis
  addJob: (job: TJob) => void
  jobs: any
  dataSourceId: string
}

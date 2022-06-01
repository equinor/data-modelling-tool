import { DmtSettings, TBlob, TContainerImage, TReference } from '@dmt/common'
import { ReactNode } from 'react'

export type TRoute = {
  path: string
  heading: string
  content: ReactNode
}

export type TApp = {
  applications: DmtSettings[]
  settings: DmtSettings
}

export type TAnalysis = {
  _id: string
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

export type TCronJob = {
  cron: string
  startDate: Date
  endDate: Date
}

export type TContent = {
  heading: string
  content: ReactNode
  settings: DmtSettings
}

export type TLayout = {
  heading: string
  content: ReactNode
  settings: DmtSettings
  allApps: DmtSettings[]
}

export enum JobStatus {
  CREATED = 'created',
  STARTING = 'starting',
  RUNNING = 'running',
  FAILED = 'failed',
  COMPLETED = 'completed',
  UNKNOWN = 'unknown',
}

export type TJob = {
  label: string
  name: string
  type: string
  status: JobStatus
  triggeredBy: string
  applicationInput: TReference
  runner?: TJobHandler | TContainerJobHandler
  started: string
  result?: any
  ended?: string
  outputTarget?: string
  referenceTarget?: string
}

//Represents Container blueprint from WorkflowDS/Blueprints/jobHandlers/Container.json
export type TContainerJobHandler = {
  label?: string
  image: TContainerImage
  command: string[]
  environmentVariables?: string[]
}

//Represents JobHandler blueprint from WorkflowDS/Blueprints/jobHandlers/JobHandler.json
export type TJobHandler = {
  environmentVariables?: string[]
}

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

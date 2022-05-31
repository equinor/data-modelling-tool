import { DmtSettings, TBlob, TReference } from '@dmt/common'
import { ReactNode } from 'react'

export type TRoute = {
  path: string
  heading: string
  content: ReactNode
}

export type TApp = {
  applications: any
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

todo - update Container.json entities to use  dict in the container attribute and not string

export type TContainerImage = {
  name: string
  subName?: string
  description?: string
  type: string
  version: string
  registryName: string
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

export type TSIMAApplicationInput = {
  _id?: string
  name: string
  description?: string
  type: string
  inputType: string
  outputType: string
  input: any
  SIMAComputeConfig?: TBlob
  stask?: TBlob
  workflow: string
  workflowTask: string
  resultPath: string
  resultReferenceLocation?: string
}

export type TLocalContainerJob = {
  type: string
  name: string
  label?: string
  image: string
  command: string
  environmentVariables?: string[]
}

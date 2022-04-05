import { DmtSettings } from '@dmt/common'
import { ReactNode } from 'react'
import { TBlob, TReference } from '../../../shared/common'

export type TRoute = {
  path: string
  heading: string
  content: ReactNode
}

export type TApp = {
  applications: any
  settings: DmtSettings
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

export type TJob = {
  label: string
  name: string
  type: string
  triggeredBy: string
  job_entity_id: string //todo add this to blueprint??
  applicationInput: TReference
  runner?: TJobHandler | TContainerJobHandler
  started: string
  result?: any
  ended?: string
  outputTarget?: string
}

//Represents Container blueprint from WorkflowDS/Blueprints/jobHandlers/Container.json
export type TContainerJobHandler = {
  label?: string
  image: string
  command: string[]
  environmentVariables?: string[]
}

//Represents JobHandler blueprint from WorkflowDS/Blueprints/jobHandlers/JobHandler.json
export type TJobHandler = {
  environmentVariables?: string[]
}

export type TTask = {
  type: string
  description: string
  label: string
  inputType: string
  applicationInput: TReference
  outputType: string
  runner: TJobHandler | TContainerJobHandler
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

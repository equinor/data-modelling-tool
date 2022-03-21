import { DmtSettings } from '@dmt/common'
import { ReactNode } from 'react'
import { TBlob } from '../../../shared/common'

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
  type: string
  triggeredBy: string
  applicationInput: TSIMAApplicationInput
  runner: TContainerJobHandler
  started: string
  result?: any
  ended: string
  outputTarget?: string
}

export type TContainerJobHandler = {
  name: string
  type: string
  description?: string
  label?: string
  image: string
  command: string[]
}

export type TTask = {
  type: string
  description: string
  label: string
  inputType: string
  applicationInput: TSIMAApplicationInput
  outputType: string
  runner: TContainerJobHandler
}

export type TSIMAApplicationInput = {
  name: string
  description?: string
  type: string
  inputType: string
  outputType: string
  input: string //entity as a json string
  SIMAComputeConfig?: TBlob
  stask?: TBlob
  workflow: string
  workflowTask: string
}

export type TLocalContainerJob = {
  type: string
  name: string
  label?: string
  image: string
  command: string
  environmentVariables?: string[]
}

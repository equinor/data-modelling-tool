import { ReactNode } from 'react'
import { EJobStatus } from './Enums'

export type TRoute = {
  path: string
  content: ReactNode
}

export type TApp = {
  applications: any
  settings: DmtSettings
}

export type TContent = {
  content: ReactNode
  settings: DmtSettings
}

export type TLayout = {
  content: ReactNode
  settings: DmtSettings
  allApps: DmtSettings[]
}

export type TReference = {
  type: string
  _id: string
  name?: string
}

export type TBlob = {
  _blob_id: string
  name: string
  type: string
}

export type TLocation = {
  lat: number
  long: number
  name: string
  _id?: string
  type?: string
}

export type TContainerImage = {
  _id?: string
  uid?: string
  imageName: string
  description?: string
  type: string
  version: string
  registryName: string
}

export type DmtSettings = {
  name: string
  label: string
  tabIndex: number
  hidden: boolean
  visibleDataSources: any
  type: string
  description: string
  packages: any
  models: any
  actions: any
  fileLocation: string
  dataSourceAliases: any
  urlPath: string
}

//Represents JobHandler blueprint from WorkflowDS/Blueprints/jobHandlers/JobHandler.json
export type TJobHandler = {
  type: string
  environmentVariables?: string[]
}

//Represents Container blueprint from WorkflowDS/Blueprints/jobHandlers/Container.json
export type TContainerJobHandler = {
  type: string
  label?: string
  image: string
  command: string[]
  environmentVariables?: string[]
}

export type TJob = {
  label: string
  name: string
  type: string
  status: EJobStatus
  triggeredBy: string
  applicationInput: TReference
  runner: TJobHandler | TContainerJobHandler
  started: string
  uid?: string
  result?: any
  ended?: string
  outputTarget?: string
  referenceTarget?: string
}

export type TLocalContainerJob = {
  type: string
  name: string
  label?: string
  image: string
  command: string
  environmentVariables?: string[]
}

export type TCronJob = {
  cron: string
  startDate: Date
  endDate: Date
}

export type TValidEntity = {
  type: string
  [key: string]: any
}

import { ReactNode } from 'react'
import { EJobStatus } from './Enums'

export type TRoute = {
  path: string
  content: ReactNode
}

export type TApp = {
  applications: any
  settings: TDmtSettings
}

export type TContent = {
  content: ReactNode
  settings: TDmtSettings
}

export type TLayout = {
  content: ReactNode
  settings: TDmtSettings
  allApps: TDmtSettings[]
}

export type TReference = {
  type: string
  _id: string
  name?: string
}

export type TBlob = {
  _blob_id?: string
  name: string
  type: string
}

export type TLocation = {
  lat: number
  long: number
  name: string
  label?: string
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

export type TGenericObject = {
  [key: string]: any
}

export type TSTaskBody = {
  type: string
  name: string
  blob: TBlob
}
export type TRunner = { image?: any; type: string }

export type TContainer = {
  label?: string
  image: TContainerImage
  customCommand?: string
}

export type TTaskFormData = {
  applicationInput?: TGenericObject
  runner?: TRunner
  type?: string
  outputType?: string
  inputType?: string
  description?: string
  label?: string
  name?: string
}

export type TDmtSettings = {
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

export type TUserIdMapping = { userId: string; username: string }

import { OperationStatus } from './Enums'

export type DmtSettings = any

export type TRoute = {
  path: string
  heading: string
  content: JSX.Element
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
  content: JSX.Element
  settings: DmtSettings
}

export type TLayout = {
  heading: string
  content: string
  settings: DmtSettings
}

export type TLocation = {
  lat: number
  long: number
  name: string
  _id?: string
  type?: string
}

export type TOperationMeta = { name: string; label: string; dateRange: Date[] }

export type TConfig = {
  name: string
  simaVersion: string
  phases: TPhase[]
  description?: string
  _id?: string
  type?: string
}

export type StringMap = {
  [key: string]: string
}

export type TReference = {
  name: string
  type: string
  _id: string
}
export type TJob = {
  name: string
  label?: string
  image: string
  command: string[]
  type: string
  subnetId?: string
  logAnalyticsWorkspaceResourceId?: string
}

export type TGraph = {
  run: number
  response: number
  statistic: number
  uuid?: string
  type?: string
}

export type TPlot = {
  graphs: TGraph[]
  type?: string
}

export type TSimulationConfig = {
  name: string
  variables: TVariable[]
  jobs: TJob[]
  results: TReference[]
  cronJob: any
  published: boolean
  type?: string
  plots?: TPlot[]
}

export type TPhase = {
  simulationConfigs: TSimulationConfig[]
  name: string
  workflowTask: string
  workflow: string
  start?: string
  end?: string
  defaultVariables?: TVariable
}

export type TVariable = {
  name: string
  value: string
  valueType: string
  unit: string
  type: string
}

export type TBlob = {
  _blob_id: string
  name: string
  type: string
}

export type TOperationStatus =
  | OperationStatus.ONGOING
  | OperationStatus.CONCLUDED
  | OperationStatus.UPCOMING

export type TComment = {
  _id?: string
  author: string
  date: Date
  message: string
  operation: string
}

import {
  TReference,
  TJob,
  TJobHandler,
  TContainerJobHandler,
  TLocation,
  TValidEntity,
} from '@development-framework/dm-core'

export type TAsset = {
  _id: string
  type: string
  name: string
  description?: string
  created: string
  updated: string
  label?: string
  creator: string
  analyses: TAnalysis[]
  location?: TLocation
  start?: string
  end?: string
  contact?: string
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

export type TDocumentInfoCardProps = {
  document: TValidEntity
  dataSourceId: string
  fields?: { [key: string]: string | number | boolean }
  actions?: JSX.Element
  disableDefaultFields?: boolean
  disableDefaultActions?: boolean
}

export type TAnalysisInfoCardProps = {
  analysis: TAnalysis
  addJob: (job: TJob) => void
  jobs: any
  dataSourceId: string
}

export type TAssetInfoCardProps = {
  asset: TAsset
  analyses: any
  dataSourceId: string
}

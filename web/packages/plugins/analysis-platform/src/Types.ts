import {
  TReference,
  TJob,
  TJobHandler,
  TContainerJobHandler,
  TLocation,
} from '@dmt/common'

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
  responsible?: string
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

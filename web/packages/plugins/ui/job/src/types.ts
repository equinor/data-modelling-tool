import { TReference } from '@dmt/common'

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
  runner?: any
  started: string
  result?: any
  ended?: string
  outputTarget?: string
  referenceTarget?: string
}

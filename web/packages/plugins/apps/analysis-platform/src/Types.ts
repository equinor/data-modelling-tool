import { DmtSettings } from '@dmt/common'
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
  name: string
  label?: string
  image: string
  command: string[]
  type: string
  subnetId?: string
  logAnalyticsWorkspaceResourceId?: string
}

export type TTask = {
  type: string
  description: string
  label: string
  inputType: string
  input: any
  outputType: string
  runner: { type: string }
}

export type TTtestJob = {
  type: string
  triggeredBy: string
  outputTarget: string
  input: any
  runner: { type: string }
  label?: string
  resultLinkTarget: string
  // image: string
  // command: string
  // environmentVariables?: string[]
}

export type TLocalContainerJob = {
  type: string
  name: string
  label?: string
  image: string
  command: string
  environmentVariables?: string[]
}

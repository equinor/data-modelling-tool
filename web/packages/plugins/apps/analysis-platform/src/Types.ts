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

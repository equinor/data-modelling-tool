import React, { createContext, ReactNode, useContext } from 'react'
import { ILayout, useLayout } from './useLayout'
import {
  DmssAPI,
  useDataSources,
  IDataSources,
} from '@development-framework/dm-core'

export interface IModels {
  layout: ILayout
  dataSources: IDataSources
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOperations {}

export interface IDashboard {
  models: IModels
  operations: IOperations
}
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const DashboardContext = createContext<IDashboard>(null!)

export const DashboardConsumer = DashboardContext.Consumer

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error(
      'useDashboardContext must be used within a DashboardProvider'
    )
  }
  return context
}

interface IDashboardProviderProps {
  dmssAPI: DmssAPI
  children?: ReactNode
}

const DashboardProvider = ({ dmssAPI, children }: IDashboardProviderProps) => {
  const layout: ILayout = useLayout()
  const dataSources: IDataSources = useDataSources(dmssAPI)

  const value: IDashboard = {
    models: {
      layout,
      dataSources,
    },
    operations: {},
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export default DashboardProvider

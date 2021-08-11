import React, { createContext, ReactNode, useContext } from 'react'
import { ILayout, useLayout } from './useLayout'
import { IDataSourceAPI, useDataSources, IDataSources } from '@dmt/common'

export interface IModels {
  layout: ILayout
  dataSources: IDataSources
}

export interface IOperations {}

export interface IDashboard {
  models: IModels
  operations: IOperations
}

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

interface DashboardProviderProps {
  dataSourceApi: IDataSourceAPI
  children?: ReactNode
}

const DashboardProvider = ({
  dataSourceApi,
  children,
}: DashboardProviderProps) => {
  const layout: ILayout = useLayout()
  const dataSources: IDataSources = useDataSources(dataSourceApi)

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
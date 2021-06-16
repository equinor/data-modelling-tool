import React from 'react'
import Editor from './editor/Editor'
import DashboardProvider from '../context/dashboard/DashboardProvider'
import { ApplicationContext, DataSourceAPI } from '@dmt/common'

const dataSourceAPI = new DataSourceAPI()

export default ({ settings, allVisibleDataSources }: any) => {
  return (
    <ApplicationContext.Provider
      value={{ ...settings, allVisibleDataSources: allVisibleDataSources }}
    >
      <DashboardProvider dataSourceApi={dataSourceAPI}>
        <Editor />
      </DashboardProvider>
    </ApplicationContext.Provider>
  )
}

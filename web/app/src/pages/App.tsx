import React from 'react'
import Editor from './editor/Editor'
import DashboardProvider from '../context/dashboard/DashboardProvider'
import { ApplicationContext, DataSourceAPI } from '@dmt/common'

const dataSourceAPI = new DataSourceAPI()

export default ({ settings }: any) => {
  return (
    <ApplicationContext.Provider value={settings}>
      <DashboardProvider dataSourceApi={dataSourceAPI}>
        <Editor />
      </DashboardProvider>
    </ApplicationContext.Provider>
  )
}

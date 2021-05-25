import React from 'react'
import Editor from './editor/Editor'
import DashboardProvider from '../context/dashboard/DashboardProvider'
import { Application, DataSourceAPI } from '@dmt/common'

const dataSourceAPI = new DataSourceAPI()

export default () => {
  return (
    <DashboardProvider
      dataSourceApi={dataSourceAPI}
      application={Application.DEFAULT}
    >
      <Editor />
    </DashboardProvider>
  )
}

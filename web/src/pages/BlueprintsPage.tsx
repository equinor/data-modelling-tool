import React from 'react'
import { Application } from '../utils/variables'
import Editor from './editor/Editor'
import DashboardProvider from '../context/dashboard/DashboardProvider'
import DataSourceAPI from '../services/api/DataSourceAPI'

const dataSourceAPI = new DataSourceAPI()

export default () => {
  return (
    <DashboardProvider
      dataSourceApi={dataSourceAPI}
      application={Application.BLUEPRINTS}
    >
      <Editor />
    </DashboardProvider>
  )
}

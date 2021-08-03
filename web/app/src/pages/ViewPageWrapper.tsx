import React from 'react'

import DashboardProvider from '../context/dashboard/DashboardProvider'
import {ApplicationContext, DataSourceAPI} from '@dmt/common'
import ViewPage from "./ViewPage";

const dataSourceAPI = new DataSourceAPI()

export default ({ settings }: any) => {
  return (
    <ApplicationContext.Provider value={settings}>
      <DashboardProvider dataSourceApi={dataSourceAPI}>
        <ViewPage />
      </DashboardProvider>
    </ApplicationContext.Provider>
  )
}

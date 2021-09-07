import React from 'react'
import Editor from './editor/Editor'
import DashboardProvider from '../context/dashboard/DashboardProvider'
import { ApplicationContext, DmssAPI } from '@dmt/common'

const dmssAPI = new DmssAPI()

export default ({ settings }: any) => {
  return (
    <ApplicationContext.Provider value={settings}>
      <DashboardProvider dmssAPI={dmssAPI}>
        <Editor />
      </DashboardProvider>
    </ApplicationContext.Provider>
  )
}

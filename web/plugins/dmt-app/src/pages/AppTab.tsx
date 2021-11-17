import React, { useContext } from 'react'
import Editor from './editor/Editor'
import DashboardProvider from '../context/dashboard/DashboardProvider'
import { ApplicationContext, DmssAPI, AuthContext } from '@dmt/common'

export default ({ settings }: any) => {
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  return (
    <ApplicationContext.Provider value={settings}>
      <DashboardProvider dmssAPI={dmssAPI}>
        <Editor />
      </DashboardProvider>
    </ApplicationContext.Provider>
  )
}

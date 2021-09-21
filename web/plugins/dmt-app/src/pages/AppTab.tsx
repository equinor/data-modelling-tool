import React, { useContext } from 'react'
import Editor from './editor/Editor'
import DashboardProvider from '../context/dashboard/DashboardProvider'
import { ApplicationContext, DmssAPI } from '@dmt/common'
import { AuthContext } from '../../../../app/src/context/auth/AuthContext'

export default ({ settings }: any) => {
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

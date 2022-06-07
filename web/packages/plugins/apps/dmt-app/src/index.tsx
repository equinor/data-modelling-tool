import * as React from 'react'
import { AuthContext, DmssAPI, DmtPluginType, Header } from '@dmt/common'
import SearchPage from './pages/SearchPage'
import ViewPage from './pages/ViewPage'
import { Route, Routes } from 'react-router-dom'
import { useContext } from 'react'
import DashboardProvider from './context/dashboard/DashboardProvider'
import Editor from './pages/editor/Editor'

const PageComponent = (props: any) => {
  const { applications, settings } = props
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  return (<div>
    <Header
      allApps={applications}
      appName={settings.label}
      urlPath={settings.urlPath}
    />
    <Routes>
      <Route path="/DMT/search" element={<SearchPage settings={settings}/>}/>
      <Route path="/DMT/view/:data_source/:entity_id" element={<ViewPage settings={settings}/>}/>
      <Route path={`/${settings.name}/*`} element={<DashboardProvider dmssAPI={dmssAPI}>
        <Editor/>
      </DashboardProvider>}/>
    </Routes>
  </div>)
}

export const plugins: any = [{
  pluginName: 'DMT', pluginType: DmtPluginType.PAGE, component: PageComponent,
}]

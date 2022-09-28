import * as React from 'react'
import {
  AuthContext,
  DmssAPI,
  EDmtPluginType,
  Header,
} from '@development-framework/dm-core'
import SearchPage from './pages/SearchPage'
import ViewPage from './pages/ViewPage'
import { Route } from 'react-router-dom'
import { useContext } from 'react'
import DashboardProvider from './context/dashboard/DashboardProvider'
import Editor from './pages/editor/Editor'

const PageComponent = (props: any) => {
  const { applications, settings } = props
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  return (
    <div>
      <Header
        allApps={applications}
        appName={settings.label}
        urlPath={settings.urlPath}
      />
      <Route
        path="/DMT/search"
        render={() => <SearchPage settings={settings} />}
      />
      <Route
        exact
        path="/DMT/view/:data_source/:entity_id"
        component={() => <ViewPage settings={settings} />}
      />
      <Route
        exact
        path={`/${settings.name}`}
        render={() => (
          <DashboardProvider dmssAPI={dmssAPI}>
            <Editor />
          </DashboardProvider>
        )}
      />
    </div>
  )
}

export const plugins: any = [
  {
    pluginName: 'DMT',
    pluginType: EDmtPluginType.PAGE,
    component: PageComponent,
  },
]

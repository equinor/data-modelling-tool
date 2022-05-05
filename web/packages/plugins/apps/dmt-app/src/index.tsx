import * as React from 'react'
//@ts-ignore
import { AuthContext, DmssAPI, DmtPluginType } from '@dmt/common'
import Header from './AppHeader'
import SearchPage from './pages/SearchPage'
import ViewPage from './pages/ViewPage'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { useContext } from 'react'
import DashboardProvider from './context/dashboard/DashboardProvider'
import Editor from './pages/editor/Editor'

const Wrapper = styled.div`
  padding: 20px;
`

const PageComponent = (props: any) => {
  const { applications, settings } = props
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)

  return (
    <Wrapper>
      <Header applications={applications} />
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
    </Wrapper>
  )
}

export const plugins: any = [
  {
    pluginName: 'DMT',
    pluginType: DmtPluginType.PAGE,
    content: {
      component: PageComponent,
    },
  },
]

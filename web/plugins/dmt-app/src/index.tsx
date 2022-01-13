import * as React from 'react'
import { DmtPluginType } from '@dmt/common'
import Header from './AppHeader'
import AppTab from './pages/AppTab'
import SearchPage from './pages/SearchPage'
import ViewPage from './pages/ViewPage'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 20px;
`

const App = (props: any) => {
  const { settings } = props
  return (
    <div>
      <AppTab settings={settings} />
    </div>
  )
}

const PageComponent = (props: any) => {
  const { applications, settings } = props

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
        component={ViewPage}
      />
      <Route
        exact
        path={`/${settings.name}`}
        render={() => <App settings={settings} applications={applications} />}
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

import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { NotificationContainer, NotificationManager } from 'react-notifications'

import { Switch } from 'react-router'
import Header from './AppHeader'
import AppTab from './pages/AppTab'
import { authContext } from './context/auth/adalConfig'
import { AuthProvider } from './context/auth/AuthContext'
import { systemAPI } from '@dmt/common/src/services/api/SystemAPI'
import SearchPage from './pages/SearchPage'
import ViewPage from './pages/ViewPage'

export const Config = {
  exportedApp: parseInt(process.env.REACT_APP_EXPORTED_APP) === 1,
}

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    font-family: Equinor-Regular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

`
const Wrapper = styled.div`
  padding: 20px;
`

const theme = {
  flexboxgrid: {
    gutterWidth: 0, // rem
    outerMargin: 0, // rem
  },
}

function App() {
  const [applications, setApplications] = useState(undefined)
  const [firstVisibleApplication, setFirstVisibleApplication] = useState(undefined)
  useEffect(() => {
    systemAPI.getSystemSettings().then((res) => {
      setApplications(res.data)
      setFirstVisibleApplication(getFirstVisibleApplicationSettings(res.data))
      //THERE IS SOMETHING MISSING HERE. below func should be moved!
    })
  }, [])

  const getFirstVisibleApplicationSettings = (applications) => {
    const apps = Object.values(applications)
    for (let i = 0; i<apps.length; i++) {
      let app = apps[i]
      if (app?.hidden ) continue
      else return apps[i]// apps[i]
    }

    NotificationManager.error("Error: found no applications that are set to 'visible'. Try to update an application's settings.json to 'hidden': false")
  }


  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider idToken={authContext.getCachedUser()}>
          <GlobalStyle />
          <NotificationContainer />
          {applications && firstVisibleApplication && (
            <Wrapper>
              <Header applications={applications} initialActiveApp={firstVisibleApplication} />
              <Switch>
                {Object.values(applications).map((setting) => {
                  if (!setting?.hidden) {
                    return (
                      <Route
                        exact
                        path={`/${setting.name}`}
                        render={() => <AppTab settings={setting} />}
                      />
                    )
                  }
                })}
                <Route
                  exact
                  path="/search"
                  render={() => (
                    <SearchPage settings={firstVisibleApplication} />
                  )}
                />
                <Route
                  path="/view/:data_source/:entity_id"
                  component={ViewPage}
                />
                <Route
                  exact
                  path={'/'}
                  render={() => (
                    <AppTab settings={firstVisibleApplication} />
                  )}
                />
              </Switch>
            </Wrapper>
          )}
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App

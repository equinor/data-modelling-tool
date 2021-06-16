import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'
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
  const [applications, setApplications] = useState(null)
  useEffect(() => {
    systemAPI.getSystemSettings().then((res) => {
      setApplications(res.data)
    })
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider idToken={authContext.getCachedUser()}>
          <GlobalStyle />
          <NotificationContainer />
          {applications && (
            <Wrapper>
              <Header applications={applications} />
              <Switch>
                {Object.values(applications).map((setting) => {
                  return (
                    <Route
                      exact
                      path={`/${setting.id}`}
                      render={() => <AppTab settings={setting} />}
                    />
                  )
                })}
                <Route
                  exact
                  path="/search"
                  render={() => (
                    <SearchPage settings={Object.values(applications)[0]} />
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
                    <AppTab settings={Object.values(applications)[0]} />
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

import React, { useEffect, useState } from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'
import { Switch } from 'react-router'
import Header from './AppHeader'
import AppTab from './pages/AppTab'
import { systemAPI } from '@dmt/common/src/services/api/SystemAPI'
import SearchPage from './pages/SearchPage'
import ViewPage from './pages/ViewPage'
import { sortApplications } from './utils/applicationHelperFunctions'

import useLocalStorage from './hooks/useLocalStorage'
import {
  getTokenFromRefreshToken,
  getTokens,
  isTokenValid,
  login,
} from './utils/authentication'

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

function App({ authEnabled }) {
  const [applications, setApplications] = useState(undefined)
  const [token, setToken] = useLocalStorage('token', null)
  const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', null)
  const [loggedIn, setLoggedIn] = useLocalStorage('loggedIn', false)

  const storeTokens = () => {
    if (!loggedIn) {
      setLoggedIn(true)
      login()
    }
    if (loggedIn && !isTokenValid(token)) {
      if (isTokenValid(refreshToken)) {
        getTokenFromRefreshToken(refreshToken).then((response) => {
          setRefreshToken(response['refresh_token'])
          setToken(response['access_token'])
        })
      } else {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        if (!code) login()
        if (code) {
          getTokens().then((response) => {
            setRefreshToken(response['refresh_token'])
            setToken(response['access_token'])
          })
        }
      }
    }
  }

  useEffect(() => {
    systemAPI.getSystemSettings().then((res) => {
      setApplications(
        sortApplications(res.data).filter(
          (application) => application?.hidden !== true
        )
      )
    })

    if (authEnabled) {
      storeTokens()
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <NotificationContainer />
        {applications && (
          <Wrapper>
            <Header applications={applications} />
            <Switch>
              {Object.values(applications).map((setting) => (
                <Route
                  exact
                  path={`/${setting.name}`}
                  render={() => <AppTab settings={setting} />}
                  key={setting.name}
                />
              ))}
              <Route
                exact
                path="/search"
                render={() => (
                  <SearchPage allApplicationSettings={applications} />
                )}
              />
              <Route
                exact
                path="/view/:data_source/:entity_id"
                component={ViewPage}
              />
              <Route
                path={'/'}
                render={() => <AppTab settings={applications[0]} />}
              />
            </Switch>
          </Wrapper>
        )}
      </Router>
    </ThemeProvider>
  )
}

export default App

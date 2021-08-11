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
import { sortApplications } from './utils/applicationHelperFunctions'

import axios from 'axios'
import useLocalStorage from './hooks/useLocalStorage'

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
  const [authenticated, setAuthenticated] = useLocalStorage(
    'authenticated',
    false
  )
  const [applications, setApplications] = useState(undefined)
  const [token, setToken] = useLocalStorage('')

  const login = () => {
    const authorizationEndpoint = process.env.REACT_APP_AUTH_ENDPOINT
    const scope = 'openid'
    const clientId = process.env.REACT_APP_AUTH_CLIENT_ID
    const responseType = 'code'
    const redirectUri = window.location.href

    fetch(
      `${authorizationEndpoint}?` +
        `scope=${scope}&` +
        `response_type=${responseType}&` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}`,
      {
        redirect: 'manual',
      }
    ).then((response) => {
      window.location.replace(response.url)
      setAuthenticated(true)
    })
  }

  const storeAccessToken = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const clientId = process.env.REACT_APP_AUTH_CLIENT_ID
    const tokenEndpoint = process.env.REACT_APP_TOKEN_ENDPOINT

    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('client_id', clientId)
    params.append('code', code)
    params.append('redirect_uri', 'http://localhost/')

    axios
      .post(tokenEndpoint, params)
      .then((response) => {
        setToken(response.data['access_token'])
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    systemAPI.getSystemSettings().then((res) => {
      setApplications(
        sortApplications(res.data).filter(
          (application) => application?.hidden !== true
        )
      )
    })
  }, [])

  useEffect(() => {
    if (authenticated) {
      storeAccessToken()
    }
  }, [authenticated])

  if (!authenticated) login()
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider idToken={authContext.getCachedUser()}>
          {
            //todo use the whoami dmss endpoint to store data in authprovider
          }
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
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App

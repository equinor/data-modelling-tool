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
import Welcome from "./components/keycloacktest/Welcome";
import Secured from "./components/keycloacktest/Secured";
import Keycloak from 'keycloak-js'
import {Button} from "@dmt/common";

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
  const [keycloak, setKeycloak] = useState(null) //todo set to type for  keycloack class
  const [authenticated, setAuthenticated] = useState(false)
  const [applications, setApplications] = useState(undefined)
  useEffect(() => {
    systemAPI.getSystemSettings().then((res) => {
      setApplications(
        sortApplications(res.data).filter(
          (application) => application?.hidden !== true
        )
      )
    })

      if (!authenticated) {
       const keycloak = new Keycloak({
          realm: "MyDemo",
          url: "http://localhost:8080/auth",
          clientId: "dmt-client"
            })
          setKeycloak(keycloak)
        keycloak.init({onLoad: 'login-required'}).then((authenticated) => {
            console.log(authenticated)
            setAuthenticated(authenticated)
        })
      }
  }, [])
    //i think there is an inf loop bug here....
  if (!authenticated) return <div></div>
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider idToken={authContext.getCachedUser()} keycloakObject={keycloak}>
          <GlobalStyle />
          <NotificationContainer />
          {applications && (
            <Wrapper>
              <Header applications={applications} />
                <Button onClick={() => keycloak.logout()}>Log out</Button>
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

import React from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'
import SearchPage from './pages/SearchPage'
import ViewPage from './pages/ViewPage'

import { Switch } from 'react-router'
import { StatusProvider } from './context/status/StatusContext'
import Header from './AppHeader'
import DMTEntities from './pages/DMTEntities'
import DefaultApp from './pages/App'
import { authContext } from './context/auth/adalConfig'
import { AuthProvider } from './context/auth/AuthContext'

export const Config = {
  exportedApp: parseInt(process.env.REACT_APP_EXPORTED_APP) === 1,
  appName: process.env.REACT_APP_EXPORTED_APP_NAME || 'Data Modelling',
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
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider idToken={authContext.getCachedUser()}>
          <GlobalStyle />
          <StatusProvider>
            <NotificationContainer />
            <Wrapper>
              <Header />
              <Switch>
                <Route exact path="/app" component={DMTEntities} />
                <Route exact path="/search" component={SearchPage} />
                <Route
                  path="/view/:data_source/:entity_id"
                  component={ViewPage}
                />
                <Route path="/" component={DefaultApp} />
              </Switch>
            </Wrapper>
          </StatusProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
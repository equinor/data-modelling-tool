import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'
import SearchPage from './pages/SearchPage'
import ViewPage from './pages/ViewPage'

import { Switch } from 'react-router'
import { StatusProvider } from './pages/common/StatusContext'
import Header from './pages/common/Header'
import BlueprintsPage from './pages/BlueprintsPage'
import EntitiesPage from './pages/EntitiesPage'

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

function App() {
  return (
    <Router>
      <GlobalStyle />
      <StatusProvider>
        <NotificationContainer />
        <Wrapper>
          <Header />
          <Switch>
            <Route exact path="/search" component={SearchPage} />
            <Route exact path="/blueprints" component={BlueprintsPage} />
            <Route exact path="/entities" component={EntitiesPage} />
            <Route path="/view/:data_source/:entity_id" component={ViewPage} />
            <Route path="/" component={BlueprintsPage} />
          </Switch>
        </Wrapper>
      </StatusProvider>
    </Router>
  )
}

export default App

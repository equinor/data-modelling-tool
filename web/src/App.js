import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import BlueprintsPage from './pages/blueprints/BlueprintsPage'
import { NotificationContainer } from 'react-notifications'
import EntitiesPage from './pages/entities/EntitiesPage'
import DocumentEditorPage from './pages/DocumentEditorPage'
import { Switch } from 'react-router'

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    // margin: 0 auto 25px;
    // max-width: 1600px;
    font-family: Equinor-Regular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    // max-width: 1600px;
  }
`

function App() {
  return (
    <Router>
      <GlobalStyle />

      <NotificationContainer />

      <Switch>
        <Route path="/blueprints" component={BlueprintsPage} />
        <Route path="/entities" component={EntitiesPage} />
        <Route exact path="/" component={DocumentEditorPage} />
      </Switch>
    </Router>
  )
}

export default App

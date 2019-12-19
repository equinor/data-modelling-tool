import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'
import DocumentEditorPage from './pages/DocumentEditorPage'
import { Switch } from 'react-router'
import { StatusProvider } from './pages/common/StatusContext'

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    font-family: Equinor-Regular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
`

function App() {
  return (
    <Router>
      <GlobalStyle />
      <StatusProvider>
        <NotificationContainer />
        <Switch>
          <Route exact path="/" component={DocumentEditorPage} />
        </Switch>
      </StatusProvider>
    </Router>
  )
}

export default App

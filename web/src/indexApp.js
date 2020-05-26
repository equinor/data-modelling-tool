import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'react-notifications/lib/notifications.css'
import App from './App'
import { ThemeProvider } from 'styled-components'
import { AuthProvider } from './auth/AuthContext'
import { authContext } from './auth/adalConfig'

const theme = {
  flexboxgrid: {
    gutterWidth: 0, // rem
    outerMargin: 0, // rem
  },
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <AuthProvider idToken={authContext.getCachedUser()}>
      <App />
    </AuthProvider>
  </ThemeProvider>,
  document.getElementById('root')
)

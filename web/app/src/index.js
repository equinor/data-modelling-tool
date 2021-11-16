import React from 'react'
import './index.css'
import 'react-notifications/lib/notifications.css'

import App from './App'
import ReactDOM from 'react-dom'
import { AuthProvider } from 'react-oauth2-code-pkce'

const authEnabled = process.env.REACT_APP_AUTH === '1'
const authConfig = {
  clientId: process.env.REACT_APP_AUTH_CLIENT_ID || '',
  authorizationEndpoint: process.env.REACT_APP_AUTH_ENDPOINT || '',
  tokenEndpoint: process.env.REACT_APP_TOKEN_ENDPOINT || '',
  scope: process.env.REACT_APP_AUTH_SCOPE + ' openid' || '',
  redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI || '',
  logoutEndpoint: process.env.REACT_APP_LOGOUT_ENDPOINT || '',
}

ReactDOM.render(
  <>
    {authEnabled ? (
      <AuthProvider authConfig={authConfig}>
        <App />,
      </AuthProvider>
    ) : (
      <App />
    )}
  </>,
  document.getElementById('root')
)

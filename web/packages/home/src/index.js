import React from 'react'
import './index.css'
import 'react-notifications/lib/notifications.css'

import App from './App'
import ReactDOM from 'react-dom'
import { AuthProvider, UiPluginProvider } from '@development-framework/dm-core'
import plugins from './plugins'

const fullCurrentURL = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`

const authEnabled = process.env.REACT_APP_AUTH === '1'
const authConfig = {
  clientId: process.env.REACT_APP_AUTH_CLIENT_ID || '',
  authorizationEndpoint: process.env.REACT_APP_AUTH_ENDPOINT || '',
  tokenEndpoint: process.env.REACT_APP_TOKEN_ENDPOINT || '',
  scope: process.env.REACT_APP_AUTH_SCOPE || '',
  redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI || '',
  logoutEndpoint: process.env.REACT_APP_LOGOUT_ENDPOINT || '',
  preLogin: () => localStorage.setItem('preLoginPath', fullCurrentURL()),
  postLogin: () => {
    if (localStorage.getItem('preLoginPath') !== fullCurrentURL()) {
      window.location.href = localStorage.getItem('preLoginPath')
    }
  },
}

ReactDOM.render(
  <>
    <UiPluginProvider pluginsToLoad={plugins}>
      {authEnabled ? (
        <AuthProvider authConfig={authConfig}>
          <App />
        </AuthProvider>
      ) : (
        <App />
      )}
    </UiPluginProvider>
  </>,
  document.getElementById('root')
)

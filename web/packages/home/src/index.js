import React from 'react'
import './index.css'
import 'react-notifications/lib/notifications.css'
import { createRoot } from 'react-dom/client'
import App from './App'

import { AuthProvider, UiPluginProvider } from '@dmt/common'
import plugins from './plugins'

const authEnabled = process.env.REACT_APP_AUTH === '1'
const authConfig = {
  clientId: process.env.REACT_APP_AUTH_CLIENT_ID || '',
  authorizationEndpoint: process.env.REACT_APP_AUTH_ENDPOINT || '',
  tokenEndpoint: process.env.REACT_APP_TOKEN_ENDPOINT || '',
  scope: process.env.REACT_APP_AUTH_SCOPE || '',
  redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI || '',
  logoutEndpoint: process.env.REACT_APP_LOGOUT_ENDPOINT || '',
  preLogin: () =>
    localStorage.setItem(
      'preLoginPath',
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    ),
  postLogin: () =>
    window.location.replace(localStorage.getItem('preLoginPath')),
}
const container = document.getElementById('root')
const root = createRoot(container)
root.render(
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
  </>
)

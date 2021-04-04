import React from 'react'
import './index.css'
import 'react-notifications/lib/notifications.css'

import { runWithAdal } from 'react-adal'
import { authContext } from './context/auth/adalConfig'
import App from './App'
import ReactDOM from 'react-dom'
import { loadPlugins } from '@dmt/core-plugins'
import config from './config.js'

const DO_NOT_LOGIN = false

loadPlugins(config)

// ADAL authentication depends on the REACT_APP_AUTH env variable set on build time in the web/Dockerfile
const authEnabled = process.env.REACT_APP_AUTH === '1'
if (authEnabled) {
  runWithAdal(
    authContext,
    () => {
      // eslint-disable-next-line
      require('./indexApp.js')
    },
    DO_NOT_LOGIN,
  )
} else {
  ReactDOM.render(<App />, document.getElementById('root'))
}

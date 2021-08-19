import React from 'react'
import './index.css'
import 'react-notifications/lib/notifications.css'

import { runWithAdal } from 'react-adal'
import { authContext } from './auth/adalConfig'
import App from './App'
import ReactDOM from 'react-dom'

const DO_NOT_LOGIN = false

// ADAL authentication depends on the REACT_APP_AUTH env variable set on build time in the web/Dockerfile
const authEnabled = process.env.REACT_APP_AUTH === '1'
if (authEnabled) {
  runWithAdal(
    authContext,
    () => ReactDOM.render(<App />, document.getElementById('root')),
    DO_NOT_LOGIN
  )
} else {
  ReactDOM.render(<App />, document.getElementById('root'))
}

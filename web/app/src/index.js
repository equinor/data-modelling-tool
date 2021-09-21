import React from 'react'
import './index.css'
import 'react-notifications/lib/notifications.css'

import App from './App'
import ReactDOM from 'react-dom'
import { AuthProvider } from '@dmt/common'

const authEnabled = process.env.REACT_APP_AUTH === '1'

ReactDOM.render(
  <AuthProvider authEnabled={authEnabled}>
    <App />,
  </AuthProvider>,
  document.getElementById('root')
)

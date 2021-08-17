import React from 'react'
import './index.css'
import 'react-notifications/lib/notifications.css'

import App from './App'
import ReactDOM from 'react-dom'
import { loadPlugins } from '@dmt/core-plugins'
import config from './config.js'

loadPlugins(config)

const authEnabled = process.env.REACT_APP_AUTH === '1'

ReactDOM.render(
  <App authEnabled={authEnabled} />,
  document.getElementById('root')
)

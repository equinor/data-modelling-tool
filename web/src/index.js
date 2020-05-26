import React from 'react'
import './index.css'
import 'react-notifications/lib/notifications.css'

import { runWithAdal } from 'react-adal'
import { authContext } from './auth/adalConfig'

const DO_NOT_LOGIN = false

runWithAdal(
  authContext,
  () => {
    // eslint-disable-next-line
    require('./indexApp.js')
  },
  DO_NOT_LOGIN
)

import React from 'react'
import { DmtPluginType } from '@dmt/common'

import App from './App'

export const plugins: any = [
  {
    pluginName: 'analysisPlatformApp',
    pluginType: DmtPluginType.PAGE,
    component: App,
  },
]

export * from './modules/Analysis'
export * from './utils/auth'

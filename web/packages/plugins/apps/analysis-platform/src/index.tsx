import React from 'react'
import { DmtPluginType } from '@dmt/common'

import App from './App'

export const plugins: any = [
  {
    pluginName: 'ap',
    pluginType: DmtPluginType.PAGE,
    content: {
      component: App,
    },
  },
]

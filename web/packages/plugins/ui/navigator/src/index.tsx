import * as React from 'react'
import { DmtPluginType } from '@dmt/common'
import { NavigatorContainer } from './NavigatorContainer'

export const plugins: any = [
  {
    pluginName: 'navigator',
    pluginType: DmtPluginType.UI,
    component: NavigatorContainer,
  },
]

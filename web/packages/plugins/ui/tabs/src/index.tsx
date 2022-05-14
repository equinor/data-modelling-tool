import * as React from 'react'
import { DmtPluginType } from '@dmt/common'
import { TabsContainer } from './TabsContainer'
import { NavigatorContainer } from './NavigatorContainer'

export const plugins: any = [
  {
    pluginName: 'tabs',
    pluginType: DmtPluginType.UI,
    component: TabsContainer,
  },
  {
    pluginName: 'navigator',
    pluginType: DmtPluginType.UI,
    component: NavigatorContainer,
  },
]

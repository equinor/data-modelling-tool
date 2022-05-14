import * as React from 'react'
export { useTabContext } from './TabsContext'
import { DmtPluginType } from '@dmt/common'
import { TabsContainer } from './TabsContainer'
import { EditInput } from './EditInput'
import { NavigatorContainer } from './NavigatorContainer'

export const plugins: any = [
  {
    pluginName: 'tabs',
    pluginType: DmtPluginType.UI,
    content: {
      component: TabsContainer,
    },
  },
  {
    pluginName: 'edit-input',
    pluginType: DmtPluginType.UI,
    content: {
      component: EditInput,
    },
  },
  {
    pluginName: 'navigator',
    pluginType: DmtPluginType.UI,
    content: {
      component: NavigatorContainer,
    },
  },
]

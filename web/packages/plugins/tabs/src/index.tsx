import { DmtPluginType } from '@data-modelling-tool/core'
import { TabsContainer } from './TabsContainer'

export const plugins: any = [
  {
    pluginName: 'tabs',
    pluginType: DmtPluginType.UI,
    component: TabsContainer,
  },
]

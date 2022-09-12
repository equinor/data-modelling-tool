import { EDmtPluginType } from '@data-modelling-tool/core'
import { TabsContainer } from './TabsContainer'

export const plugins: any = [
  {
    pluginName: 'tabs',
    pluginType: EDmtPluginType.UI,
    component: TabsContainer,
  },
]

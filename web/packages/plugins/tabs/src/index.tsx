import { EDmtPluginType } from '@development-framework/dm-core'
import { TabsContainer } from './TabsContainer'

export const plugins: any = [
  {
    pluginName: 'tabs',
    pluginType: EDmtPluginType.UI,
    component: TabsContainer,
  },
]
